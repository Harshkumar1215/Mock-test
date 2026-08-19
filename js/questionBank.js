/**
 * Question Bank Repository
 * Empty subjects data store ready for custom content insertion.
 */

window.QuestionBank = (function() {
  const subjects = [];
  const rawQuestionsDatabase = {};
  const questionCache = {};

  return {
    getSubjects: function() {
      return subjects;
    },

    getSubjectById: function(subId) {
      return subjects.find(s => s.id === subId) || null;
    },

    getTopicById: function(subjectId, topicId) {
      const subject = this.getSubjectById(subjectId);
      if (!subject) return null;
      return subject.topics.find(t => t.id === topicId);
    },

    getSubtopicById: function(subjectId, topicId, subtopicId) {
      const topic = this.getTopicById(subjectId, topicId);
      if (!topic) return null;
      return topic.subtopics.find(st => st.id === subtopicId);
    },

    get100QuestionsForSubtopic: function(subtopicId) {
      return rawQuestionsDatabase[subtopicId] || [];
    },

    searchBank: function(query) {
      if (!query || query.trim() === "") return [];
      const q = query.toLowerCase().trim();
      const results = [];

      subjects.forEach(subject => {
        if (subject.name.toLowerCase().includes(q)) {
          results.push({ type: "subject", subject });
        }
        if (subject.topics) {
          subject.topics.forEach(topic => {
            if (topic.name.toLowerCase().includes(q)) {
              results.push({ type: "topic", subject, topic });
            }
            if (topic.subtopics) {
              topic.subtopics.forEach(subtopic => {
                if (subtopic.name.toLowerCase().includes(q)) {
                  results.push({ type: "subtopic", subject, topic, subtopic });
                }
              });
            }
          });
        }
      });

      return results;
    }
  };
})();
