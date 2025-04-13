import {supabase} from '../lib/supabase';

export const fetchWeeklySummary = async (userId: string) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const {data, error} = await supabase
    .from('activities')
    .select('sum(distance) as weeklyDistance, count(*) as weeklyActivities')
    .eq('user_id', userId)
    .gte('timestamp', oneWeekAgo.toISOString());

  if (error) {
    console.error('Error fetching summary:', error);
    return {weeklyDistance: 0, weeklyActivities: 0};
  }

  return data[0] || {weeklyDistance: 0, weeklyActivities: 0};
};

export const fetchFeedActivities = async (
  userId: string | undefined,
  page: number = 1,
  limit: number = 10,
): Promise<Activity[]> => {
  try {
    const offset = (page - 1) * limit;
    const {data, error} = await supabase
      .from('activities')
      .select(
        `
        id,
        distance,
        duration,
        avgSpeed,
        timestamp,
        date,
        route,
        user_id,
        users:users!user_id (username, avatar_url),
        likes:likes (id, user_id),
        comments:comments (id, user_id, content, created_at)
      `,
      )
      .or(
        `user_id.eq.${userId},user_id.in.(select followee_id from follows where follower_id = ${userId})`,
      )
      .order('timestamp', {ascending: false})
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('피드 조회 오류:', error);
    return [];
  }
};

export const toggleLike = async (
  activityId: string,
  userId: string,
): Promise<boolean> => {
  try {
    // 좋아요 여부 확인
    const {data: existingLike, error: checkError} = await supabase
      .from('likes')
      .select('id')
      .eq('activity_id', activityId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    if (existingLike) {
      // 좋아요 삭제
      const {error: deleteError} = await supabase
        .from('likes')
        .delete()
        .eq('activity_id', activityId)
        .eq('user_id', userId);
      if (deleteError) throw deleteError;
      return false; // 좋아요 취소
    } else {
      // 좋아요 추가
      const {error: insertError} = await supabase
        .from('likes')
        .insert({activity_id: activityId, user_id: userId});
      if (insertError) throw insertError;
      return true; // 좋아요 추가
    }
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    return false;
  }
};

export const getLikeCount = async (activityId: string): Promise<number> => {
  try {
    const {count, error} = await supabase
      .from('likes')
      .select('id', {count: 'exact'})
      .eq('activity_id', activityId);
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('좋아요 카운트 오류:', error);
    return 0;
  }
};

export const isLikedByUser = async (
  activityId: string,
  userId: string,
): Promise<boolean> => {
  try {
    const {data, error} = await supabase
      .from('likes')
      .select('id')
      .eq('activity_id', activityId)
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('좋아요 상태 확인 오류:', error);
    return false;
  }
};

export const addComment = async (
  activityId: string,
  userId: string,
  content: string,
): Promise<Comment | null> => {
  try {
    const {data, error} = await supabase
      .from('comments')
      .insert({activity_id: activityId, user_id: userId, content})
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('댓글 추가 오류:', error);
    return null;
  }
};

export const fetchComments = async (
  activityId: string,
  limit: number = 5,
): Promise<Comment[]> => {
  try {
    const {data, error} = await supabase
      .from('comments')
      .select('id, activity_id, user_id, content, created_at')
      .eq('activity_id', activityId)
      .order('created_at', {ascending: false})
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    return [];
  }
};
