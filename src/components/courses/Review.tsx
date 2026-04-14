// components/course/ReviewsTab.tsx
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag, Calendar, CheckCircle, MessageSquare, Send, ChevronDown, ChevronUp, X } from 'lucide-react';
import { format } from 'date-fns';
import type { CourseReview, CreateReviewRequest } from '@/schemas/review-schema';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuthStore } from "@/stores/auth-store";
import {ReviewsService} from "@/services/review-service";

interface ReviewsTabProps {
    courseId: number;
    courseSlug: string;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ courseId, courseSlug }) => {
    const [reviews, setReviews] = useState<CourseReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [helpfulLoading, setHelpfulLoading] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

    const { user, isAuthenticated } = useAuthStore();

    // Statistics
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await ReviewsService.getByCourse(courseId);
            setReviews(response);
            calculateStats(response);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            toast.error('Failed to load reviews. Please try again.', {
                duration: 4000,
                position: 'top-center',
            });
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (reviewsData: CourseReview[]) => {
        const total = reviewsData.length;
        if (total === 0) {
            setStats({
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            });
            return;
        }

        const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / total;

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviewsData.forEach(review => {
            distribution[review.rating as keyof typeof distribution]++;
        });

        setStats({
            averageRating: average,
            totalReviews: total,
            ratingDistribution: distribution
        });
    };

    const handleStarClick = (rating: number) => {
        setSelectedRating(rating);
    };

    const handleStarHover = (rating: number) => {
        setHoveredRating(rating);
    };

    const handleStarLeave = () => {
        setHoveredRating(0);
    };

    const handleSubmitReview = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to submit a review', {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        if (selectedRating === 0) {
            toast.error('Please select a rating before submitting', {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write your review before submitting', {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        try {
            setSubmitting(true);
            const request: CreateReviewRequest = {
                rating: selectedRating,
                comment: comment.trim()
            };

            await ReviewsService.create(courseId, request);

            toast.success('Review submitted successfully! 🎉', {
                duration: 3000,
                position: 'top-center',
            });

            // Reset form
            setSelectedRating(0);
            setComment('');
            setShowReviewForm(false);
            await fetchReviews();

        } catch (error) {
            console.error('Failed to submit review:', error);
            toast.error('Unable to submit review. Please try again.', {
                duration: 4000,
                position: 'top-center',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleMarkHelpful = async (reviewId: number) => {
        if (!isAuthenticated) {
            toast.error('Please login to mark reviews as helpful', {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        try {
            setHelpfulLoading(reviewId);
            await ReviewsService.markHelpful(reviewId);

            setReviews(prev => prev.map(review =>
                review.id === reviewId
                    ? { ...review, helpful_count: (review.helpful_count || 0) + 1 }
                    : review
            ));

            toast.success('Thanks for your feedback!', {
                duration: 2000,
                position: 'top-center',
            });
        } catch (error) {
            console.error('Failed to mark helpful:', error);
            toast.error('Failed to mark review as helpful', {
                duration: 3000,
                position: 'top-center',
            });
        } finally {
            setHelpfulLoading(null);
        }
    };

    const toggleReviewExpansion = (reviewId: number) => {
        setExpandedReviews(prev => {
            const newSet = new Set(prev);
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId);
            } else {
                newSet.add(reviewId);
            }
            return newSet;
        });
    };

    const getInitials = (fullName?: string) => {
        if (!fullName) return 'U';
        return fullName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Recent';
        try {
            return format(new Date(dateString), 'MMMM d, yyyy');
        } catch {
            return 'Recent';
        }
    };

    const StarRating = ({ rating, interactive = false, size = 'md' }: { rating: number; interactive?: boolean; size?: 'sm' | 'md' | 'lg' }) => {
        const sizes = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-8 h-8'
        };

        const displayRating = interactive ? (hoveredRating || selectedRating) : rating;

        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`
              ${sizes[size]} 
              transition-all duration-200
              ${interactive ? 'cursor-pointer hover:scale-110' : ''}
              ${star <= displayRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-none text-gray-300 dark:text-gray-600'
                        }
            `}
                        onClick={() => interactive && handleStarClick(star)}
                        onMouseEnter={() => interactive && handleStarHover(star)}
                        onMouseLeave={interactive ? handleStarLeave : undefined}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                    Student Reviews
                </h3>
                <p className="text-muted-foreground">
                    Join {stats.totalReviews}+ students sharing their learning journey
                </p>
            </div>

            {/* Write Review Button */}
            {!showReviewForm && (
                <Button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg"
                >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Write Your Review
                </Button>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <div className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-2 border-primary/20 rounded-2xl p-6 shadow-xl animate-in slide-in-from-top-4 duration-300 relative">
                    <button
                        onClick={() => {
                            setShowReviewForm(false);
                            setSelectedRating(0);
                            setComment('');
                        }}
                        className="absolute top-4 right-4 p-1 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="space-y-6">
                        <div className="text-center">
                            <h4 className="text-xl font-semibold mb-3">Share Your Experience</h4>
                            <div className="flex justify-center mb-2">
                                <StarRating rating={selectedRating} interactive={true} size="lg" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {selectedRating === 0 && "Click on a star to rate"}
                                {selectedRating === 1 && "Poor - Needs improvement"}
                                {selectedRating === 2 && "Fair - Could be better"}
                                {selectedRating === 3 && "Good - Satisfactory"}
                                {selectedRating === 4 && "Very Good - Impressive"}
                                {selectedRating === 5 && "Excellent - Outstanding!"}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Your Review</label>
                            <Textarea
                                placeholder="What did you think about this course? Share your honest feedback to help other students..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                className="resize-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                <span>Minimum 10 characters</span>
                                <span>{comment.length}/2000 characters</span>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowReviewForm(false);
                                    setSelectedRating(0);
                                    setComment('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitReview}
                                disabled={submitting || selectedRating === 0 || !comment.trim() || comment.trim().length < 10}
                                className="gap-2"
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Statistics Section */}
            {stats.totalReviews > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-br from-primary/5 via-background to-primary/5 rounded-2xl border border-border">
                    {/* Average Rating */}
                    <div className="text-center md:text-left">
                        <div className="text-6xl font-bold text-primary mb-2">
                            {stats.averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center md:justify-start mb-2">
                            <StarRating rating={Math.round(stats.averageRating)} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(rating => {
                            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                            return (
                                <div key={rating} className="flex items-center gap-2 text-sm">
                                    <span className="w-8 font-medium">{rating} ★</span>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-12 text-muted-foreground text-xs">
                    {count}
                  </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-2xl bg-muted/20">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <h4 className="text-xl font-semibold mb-2">No Reviews Yet</h4>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Be the first to share your experience and help other students make informed decisions!
                    </p>
                    {!showReviewForm && (
                        <Button variant="outline" onClick={() => setShowReviewForm(true)}>
                            Write First Review
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        const isExpanded = expandedReviews.has(review.id);
                        const commentText = review.comment || '';
                        const shouldTruncate = commentText.length > 300;
                        const displayComment = isExpanded || !shouldTruncate
                            ? commentText
                            : commentText.slice(0, 300) + '...';

                        return (
                            <div
                                key={review.id}
                                className="group p-6 border border-border rounded-2xl bg-card/30 hover:bg-card/50 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Review Header */}
                                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                                            <AvatarImage src={review.user?.avatar_url || undefined} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                                {getInitials(review.user?.full_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold flex items-center gap-2 flex-wrap">
                                                {review.user?.full_name || 'Anonymous Student'}
                                                {review.is_verified_purchase && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <StarRating rating={review.rating} size="sm" />
                                                <span className="text-xs text-muted-foreground">•</span>
                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Comment */}
                                {review.comment && (
                                    <div className="mb-4">
                                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                                            {displayComment}
                                        </p>
                                        {shouldTruncate && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleReviewExpansion(review.id)}
                                                className="mt-2 text-primary hover:text-primary/80 gap-1"
                                            >
                                                {isExpanded ? (
                                                    <>Show less <ChevronUp className="h-3 w-3" /></>
                                                ) : (
                                                    <>Read more <ChevronDown className="h-3 w-3" /></>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* Review Actions */}
                                <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleMarkHelpful(review.id)}
                                        disabled={helpfulLoading === review.id}
                                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 gap-2 transition-all"
                                    >
                                        <ThumbsUp className="h-4 w-4" />
                                        <span>Helpful ({review.helpful_count || 0})</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 gap-2 transition-all"
                                        onClick={() => {
                                            toast.success('Report submitted', {
                                                description: 'Thank you for helping keep our community safe.',
                                                duration: 3000,
                                                position: 'top-center',
                                            });
                                        }}
                                    >
                                        <Flag className="h-4 w-4" />
                                        <span>Report</span>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};