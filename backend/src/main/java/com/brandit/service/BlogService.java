package com.brandit.service;

import com.brandit.dto.CommonDtos.*;
import com.brandit.entity.BlogPost;
import com.brandit.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogPostRepository blogPostRepository;

    public List<BlogPostResponse> getPublishedPosts(String category) {
        List<BlogPost> posts;
        if (category != null && !category.isBlank() && !"All".equalsIgnoreCase(category)) {
            posts = blogPostRepository.findByCategoryAndPublishedTrueOrderByCreatedAtDesc(category);
        } else {
            posts = blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc();
        }
        return posts.stream().map(this::mapToResponse).toList();
    }

    public BlogPostDetailResponse getPostBySlug(String slug) {
        BlogPost post = blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Blog post not found with slug: " + slug));

        BlogPostDetailResponse detail = new BlogPostDetailResponse();
        detail.setId(post.getId());
        detail.setTitle(post.getTitle());
        detail.setSlug(post.getSlug());
        detail.setExcerpt(post.getExcerpt());
        detail.setCategory(post.getCategory());
        detail.setTags(post.getTags());
        detail.setAuthorName(post.getAuthorName());
        detail.setCoverImageUrl(post.getCoverImageUrl());
        detail.setReadTimeMinutes(post.getReadTimeMinutes());
        detail.setPublished(post.isPublished());
        detail.setCreatedAt(post.getCreatedAt());
        detail.setContent(post.getContent());
        detail.setMetaTitle(post.getMetaTitle());
        detail.setMetaDescription(post.getMetaDescription());
        return detail;
    }

    @Transactional
    public BlogPostResponse createPost(CreateBlogRequest request) {
        String slug = toSlug(request.getTitle());
        BlogPost post = BlogPost.builder()
                .title(request.getTitle())
                .slug(slug)
                .content(request.getContent())
                .excerpt(request.getExcerpt())
                .category(request.getCategory())
                .tags(request.getTags())
                .coverImageUrl(request.getCoverImageUrl())
                .metaTitle(request.getMetaTitle())
                .metaDescription(request.getMetaDescription())
                .readTimeMinutes(request.getReadTimeMinutes() > 0 ? request.getReadTimeMinutes() : 5)
                .published(request.isPublished())
                .authorName("BrandIt Editorial")
                .build();

        return mapToResponse(blogPostRepository.save(post));
    }

    private BlogPostResponse mapToResponse(BlogPost post) {
        BlogPostResponse res = new BlogPostResponse();
        res.setId(post.getId());
        res.setTitle(post.getTitle());
        res.setSlug(post.getSlug());
        res.setExcerpt(post.getExcerpt());
        res.setCategory(post.getCategory());
        res.setTags(post.getTags());
        res.setAuthorName(post.getAuthorName());
        res.setCoverImageUrl(post.getCoverImageUrl());
        res.setReadTimeMinutes(post.getReadTimeMinutes());
        res.setPublished(post.isPublished());
        res.setCreatedAt(post.getCreatedAt());
        return res;
    }

    private String toSlug(String input) {
        return Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("[^\\w\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-")
                .toLowerCase();
    }
}
