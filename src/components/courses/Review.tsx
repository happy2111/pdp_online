import React, { useState, useEffect } from 'react';
import {
    Star,
    ThumbsUp,
    Calendar,
    MessageSquare,
    Send,
    X,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import type { CourseReview } from '@/schemas/review-schema';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuthStore } from "@/stores/auth-store";
import { ReviewsService } from "@/services/review-service";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ReviewsTabProps {
    courseId: number;
    courseSlug: string;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ courseId, courseSlug }) => {
    const t = useTranslations();
    const [reviews, setReviews] = useState<CourseReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [helpfulLoading, setHelpfulLoading] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const { isAuthenticated, user } = useAuthStore();

    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });

    useEffect(() => {
        fetchReviews(currentPage);
    }, [courseId, currentPage]);

    const fetchReviews = async (page: number) => {
        try {
            setLoading(true);
            const response = await ReviewsService.getByCourse(courseId, page, 10);
            setReviews(response.items);
            setTotalPages(response.total_pages);
            setTotalElements(response.total_elements);
            calculateStats(response.items, response.total_elements);
        } catch (error) {
            toast.error(t('errors.1000'));
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (reviewsData: CourseReview[], total: number) => {
        if (total === 0) return;
        const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviewsData.forEach(review => {
            distribution[review.rating as keyof typeof distribution]++;
        });
        setStats({
            averageRating: sum / (reviewsData.length || 1),
            totalReviews: total,
            ratingDistribution: distribution
        });
    };

    const handleEditClick = (review: CourseReview) => {
        setEditingReviewId(review.id);
        setSelectedRating(review.rating);
        setComment(review.comment || '');
        setShowReviewForm(true);
        window.scrollTo({ top: 200, behavior: 'smooth' });
    };

    const handleCancelForm = () => {
        setShowReviewForm(false);
        setEditingReviewId(null);
        setSelectedRating(0);
        setComment('');
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (!window.confirm(t('reviews.confirm_delete'))) return;

        try {
            setDeleteLoading(reviewId);
            const res = await ReviewsService.delete(reviewId);

            // Твой бэкенд возвращает code: 1 (CREATED) для всех успешных операций в этом контроллере
            if (res.code === 1 || res.code === 0) {
                toast.success(t('reviews.delete_success'));
                if (reviews.length === 1 && currentPage > 0) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    fetchReviews(currentPage);
                }
            } else {
                toast.error(t(`errors.${res.code}`));
            }
        } catch (error) {
            toast.error(t('errors.1000'));
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleSubmitReview = async () => {
        if (!isAuthenticated) return toast.error(t('reviews.login_required'));

        try {
            setSubmitting(true);
            let res;
            if (editingReviewId) {
                res = await ReviewsService.update(editingReviewId, {
                    rating: selectedRating,
                    comment: comment.trim()
                });
            } else {
                res = await ReviewsService.create(courseId, {
                    rating: selectedRating,
                    comment: comment.trim()
                });
            }

            if (res.code === 1 || res.code === 0) {
                toast.success(editingReviewId ? t('reviews.success_update') : t('reviews.success_submit'));
                handleCancelForm();
                fetchReviews(currentPage);
            } else {
                toast.error(t(`errors.${res.code}`));
            }
        } catch (error) {
            toast.error(t('errors.1000'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleMarkHelpful = async (reviewId: number) => {
        if (!isAuthenticated) return toast.error(t('reviews.login_required'));
        try {
            setHelpfulLoading(reviewId);
            const res = await ReviewsService.markHelpful(reviewId);
            if (res.code === 1 || res.code === 0) {
                setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r));
            }
        } finally {
            setHelpfulLoading(null);
        }
    };

    const StarRating = ({ rating, interactive = false, size = 'md' }: any) => {
        const displayRating = interactive ? (hoveredRating || selectedRating) : rating;
        const iconSize = size === 'lg' ? 'h-8 w-8' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
        return (
          <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    iconSize, "transition-transform",
                    interactive && "cursor-pointer hover:scale-110 active:scale-95",
                    star <= displayRating ? "fill-accent text-accent" : "fill-muted text-muted-foreground/30"
                  )}
                  onClick={() => interactive && setSelectedRating(star)}
                  onMouseEnter={() => interactive && setHoveredRating(star)}
                  onMouseLeave={() => interactive && setHoveredRating(0)}
                />
              ))}
          </div>
        );
    };

    return (
      <div className="max-w-4xl mx-auto space-y-10 py-4">
          {/* Stats Card */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-4 text-center md:border-r border-border/50">
                      <h2 className="text-5xl font-black text-foreground mb-2">{stats.averageRating.toFixed(1)}</h2>
                      <div className="flex justify-center mb-3"><StarRating rating={Math.round(stats.averageRating)} /></div>
                      <p className="text-muted-foreground font-medium">{t('reviews.subtitle', { count: stats.totalReviews })}</p>
                  </div>
                  <div className="md:col-span-5 space-y-2">
                      {[5, 4, 3, 2, 1].map(rating => {
                          const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                          const progress = stats.totalReviews > 0 ? (count / (totalElements || 1)) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center gap-4 text-sm font-medium">
                                <span className="w-4">{rating}</span>
                                <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
                                </div>
                                <span className="w-10 text-muted-foreground text-right">{Math.round(progress)}%</span>
                            </div>
                          );
                      })}
                  </div>
                  <div className="md:col-span-3 flex flex-col justify-center">
                      {!showReviewForm && (
                        <Button onClick={() => setShowReviewForm(true)} className="rounded-2xl py-6 font-bold shadow-md">
                            {t('reviews.write_review')}
                        </Button>
                      )}
                  </div>
              </div>
          </div>

          {/* Form Section */}
          {showReviewForm && (
            <div className="bg-background border-2 border-primary/20 rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full" onClick={handleCancelForm}><X className="h-5 w-5" /></Button>
                <div className="space-y-6">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">{editingReviewId ? t('reviews.edit_review') : t('reviews.share_experience')}</h3>
                        <div className="flex justify-center mb-2"><StarRating rating={selectedRating} interactive size="lg" /></div>
                    </div>
                    <Textarea
                      placeholder={t('reviews.placeholder')}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[150px] rounded-2xl"
                    />
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={handleCancelForm} className="rounded-xl">{t('common.cancel')}</Button>
                        <Button onClick={handleSubmitReview} disabled={submitting || selectedRating === 0 || comment.length < 10} className="rounded-xl px-8">
                            {submitting ? t('reviews.submitting') : editingReviewId ? t('common.save') : t('reviews.submit')}
                            <Send className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
          )}

          {/* List Section */}
          <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-20 bg-muted/10 border-2 border-dashed border-border rounded-3xl">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                    <h4 className="text-xl font-bold">{t('reviews.no_reviews')}</h4>
                </div>
              ) : (
                <>
                    {reviews.map((review) => {
                        const isOwnReview = user?.username === review.username;

                        return (
                          <div key={review.id} className={cn("bg-card border rounded-2xl p-6 transition-all hover:shadow-md", isOwnReview && "border-primary/30 ring-1 ring-primary/10")}>
                              <div className="flex items-start justify-between gap-4">
                                  <div className="flex gap-4">
                                      <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                          <AvatarImage src={review.avatar_url || undefined} />
                                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                              {review.username?.charAt(0).toUpperCase() || 'U'}
                                          </AvatarFallback>
                                      </Avatar>
                                      <div>
                                          <div className="flex items-center gap-2">
                                              <span className="font-bold text-foreground">{review.username}</span>
                                              {isOwnReview && <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-bold uppercase">{t('reviews.your_review')}</span>}
                                          </div>
                                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                              <StarRating rating={review.rating} size="sm" />
                                              <span>•</span>
                                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{review.created_at && format(new Date(review.created_at), 'dd.MM.yyyy')}</span>
                                          </div>
                                      </div>
                                  </div>

                                  {isOwnReview && (
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(review)} className="rounded-full hover:bg-primary/10 hover:text-primary">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDeleteReview(review.id)}
                                          disabled={deleteLoading === review.id}
                                          className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <Trash2 className={cn("h-4 w-4", deleteLoading === review.id && "animate-pulse")} />
                                        </Button>
                                    </div>
                                  )}
                              </div>

                              <p className="mt-4 text-foreground/80 leading-relaxed text-sm whitespace-pre-wrap">{review.comment}</p>

                              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border/50">
                                  <button
                                    onClick={() => handleMarkHelpful(review.id)}
                                    disabled={helpfulLoading === review.id || isOwnReview}
                                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                                  >
                                      <ThumbsUp className={cn("h-4 w-4", review.helpful_count > 0 && "text-primary fill-primary/10")} />
                                      {t('reviews.helpful')} ({review.helpful_count || 0})
                                  </button>
                              </div>
                          </div>
                        );
                    })}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-6">
                          <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0 || loading} className="rounded-xl"><ChevronLeft className="h-4 w-4" /></Button>
                          <span className="text-sm font-medium px-4">{currentPage + 1} / {totalPages}</span>
                          <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1 || loading} className="rounded-xl"><ChevronRight className="h-4 w-4" /></Button>
                      </div>
                    )}
                </>
              )}
          </div>
      </div>
    );
};