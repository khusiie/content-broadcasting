const supabase = require('../utils/supabase');
exports.getActiveContentForTeacher = async (teacherId, subjectFilter = null) => {
  const now = new Date();
  let query = supabase
    .from('content')
    .select('*')
    .eq('uploaded_by', teacherId)
    .eq('status', 'approved')
    .lte('start_time', now.toISOString())
    .gte('end_time', now.toISOString());
  if (subjectFilter) {
    query = query.eq('subject', subjectFilter);
  }
  const { data: contents, error } = await query;
  if (error) throw error;
  if (!contents || contents.length === 0) return [];
  const subjects = {};
  contents.forEach(content => {
    if (!subjects[content.subject]) {
      subjects[content.subject] = [];
    }
    subjects[content.subject].push(content);
  });
  const activeContents = [];
  for (const subject in subjects) {
    const subjectItems = subjects[subject];
    const contentIds = subjectItems.map(c => c.id);
    const { data: scheduleEntries } = await supabase
      .from('content_schedule')
      .select('*, content_slots!inner(subject)')
      .in('content_id', contentIds)
      .order('rotation_order', { ascending: true });
    let items;
    if (scheduleEntries && scheduleEntries.length > 0) {
      items = scheduleEntries.map(se => {
        const contentItem = subjectItems.find(c => c.id === se.content_id);
        return { ...contentItem, rotation_duration: se.duration };
      }).filter(Boolean);
    } else {
      items = subjectItems.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    if (items.length === 0) continue;
    const totalDuration = items.reduce((sum, item) => sum + (item.rotation_duration || 5), 0);
    if (totalDuration === 0) continue;
    const currentTotalMinutes = Math.floor(Date.now() / 60000);
    const elapsedInLoop = currentTotalMinutes % totalDuration;
    let runningSum = 0;
    let activeItem = items[0];
    for (const item of items) {
      runningSum += (item.rotation_duration || 5);
      if (elapsedInLoop < runningSum) {
        activeItem = item;
        break;
      }
    }
    activeContents.push(activeItem);
  }
  return activeContents;
};
