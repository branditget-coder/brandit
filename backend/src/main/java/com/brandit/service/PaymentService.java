package com.brandit.service;

import com.brandit.entity.Invoice;
import com.brandit.entity.User;
import com.brandit.entity.UserActivityLog;
import com.brandit.repository.InvoiceRepository;
import com.brandit.repository.UserActivityLogRepository;
import com.brandit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final UserActivityLogRepository activityLogRepository;

    @Transactional
    public Invoice createInvoice(String userEmail, Long amount, String currency, String planName, String provider, String transactionId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String invoiceNo = "INV-" + System.currentTimeMillis() % 1000000;

        Invoice invoice = Invoice.builder()
                .user(user)
                .invoiceNumber(invoiceNo)
                .amount(amount)
                .currency(currency != null ? currency : "INR")
                .planName(planName)
                .paymentProvider(provider)
                .transactionId(transactionId != null ? transactionId : "TXN-" + UUID.randomUUID().toString().substring(0, 8))
                .status(Invoice.Status.PAID)
                .build();

        Invoice saved = invoiceRepository.save(invoice);

        activityLogRepository.save(UserActivityLog.builder()
                .user(user)
                .action("PAYMENT_COMPLETED")
                .metadataJson("Paid " + amount + " " + saved.getCurrency() + " for plan: " + planName + " via " + provider)
                .build());

        return saved;
    }

    public List<Invoice> getUserInvoices(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return invoiceRepository.findByUserIdOrderByIssuedAtDesc(user.getId());
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAllByOrderByIssuedAtDesc();
    }
}
