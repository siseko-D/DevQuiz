import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // All topics from your quiz - dynamic and comprehensive
  const allTopics = [
    'All', 'HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Vue.js',
    'Node.js', 'Python', 'Java', 'PHP', 'Ruby', 'Go',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase'
  ]

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('quiz_history')
        .select('*')
        .order('score', { ascending: false })
        .order('created_at', { ascending: false })

      if (selectedTopic !== 'All') {
        query = query.eq('topic', selectedTopic)
      }

      const { data, error: queryError } = await query
      
      if (queryError) throw queryError
      
      if (!data || data.length === 0) {
        setLeaderboard([])
        setLoading(false)
        return
      }
      
      // Keep ONLY the highest score per username per topic
      const bestScoresMap = new Map()
      
      data.forEach(item => {
        const key = `${item.username}-${item.topic}`
        const existing = bestScoresMap.get(key)
        
        if (!existing) {
          bestScoresMap.set(key, item)
        } else if (item.score > existing.score) {
          bestScoresMap.set(key, item)
        } else if (item.score === existing.score && item.created_at > existing.created_at) {
          bestScoresMap.set(key, item)
        }
      })
      
      const combinedData = Array.from(bestScoresMap.values())
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score
          return new Date(b.created_at) - new Date(a.created_at)
        })
        .slice(0, 50)
      
      setLeaderboard(combinedData)
      
    } catch (err) {
      console.error("Error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [selectedTopic])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  const getMedal = (rank) => {
    switch(rank) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return null;
    }
  }

  const getCardStyle = (rank) => {
    switch(rank) {
      case 0:
        return { background: 'linear-gradient(135deg, #ffd70020, #ffb34720)', borderLeft: '4px solid #ffd700' };
      case 1:
        return { background: 'linear-gradient(135deg, #c0c0c020, #e8e8e820)', borderLeft: '4px solid #c0c0c0' };
      case 2:
        return { background: 'linear-gradient(135deg, #cd7f3220, #f4a46020)', borderLeft: '4px solid #cd7f32' };
      default:
        return { background: '#252525', borderLeft: '4px solid #333' };
    }
  }

  // Format timer display (if stored, otherwise show default)
  const formatTimer = (timerSeconds) => {
    if (!timerSeconds) return '60s';
    if (timerSeconds === 30) return '⚡ 30s';
    if (timerSeconds === 60) return '⏱️ 60s';
    if (timerSeconds === 90) return '🐢 90s';
    return `${timerSeconds}s`;
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="leaderboard-title">
          <span className="title-icon">🏆</span>
          <h1>Leaderboard</h1>
        </div>
        <p className="leaderboard-subtitle">Top performers across all quizzes (highest scores only)</p>
      </div>

      {/* Topic Filter - Dropdown for better UX */}
      <div style={{ marginBottom: "2rem" }}>
        <label style={{ 
          display: "block", 
          marginBottom: "0.5rem", 
          color: "#ccc",
          fontSize: "0.9rem",
          fontWeight: "500"
        }}>
          Filter by Topic:
        </label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "#333",
            border: "1px solid #4caf50",
            borderRadius: "8px",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
            outline: "none"
          }}
        >
          {allTopics.map(topic => (
            <option key={topic} value={topic}>
              {topic === 'All' ? '🌟 All Topics' : topic}
            </option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <div className="leaderboard-loading">
          <div className="loading-spinner-small"></div>
          <p>Loading scores...</p>
        </div>
      ) : error ? (
        <div className="leaderboard-error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="leaderboard-empty">
          <div className="empty-icon">📊</div>
          <h3>No scores yet</h3>
          <p>Take a quiz and save your username to appear here!</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((entry, idx) => (
            <div 
              key={idx} 
              className="leaderboard-item"
              style={getCardStyle(idx)}
            >
              <div className="leaderboard-rank">
                {getMedal(idx) || <span className="rank-number">{idx + 1}</span>}
              </div>
              <div className="leaderboard-user">
                <div className="user-avatar">
                  {entry.username?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="user-info">
                  <span className="user-name">{entry.username || 'Anonymous'}</span>
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
                    <span className="user-topic">📚 {entry.topic}</span>
                    <span className="user-topic" style={{ background: "rgba(255, 193, 7, 0.15)", color: "#ffc107" }}>
                      🎯 {entry.difficulty || 'Medium'}
                    </span>
                    <span className="user-topic" style={{ background: "rgba(33, 150, 243, 0.15)", color: "#2196f3" }}>
                      ⏱️ {formatTimer(entry.timer_seconds)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="leaderboard-score">
                <span className="score-number">{entry.score}</span>
                <span className="score-total">/{entry.total_questions}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Stats Footer */}
      {leaderboard.length > 0 && (
        <div style={{ 
          marginTop: "2rem", 
          paddingTop: "1rem", 
          borderTop: "1px solid #333",
          textAlign: "center",
          color: "#666",
          fontSize: "0.8rem"
        }}>
          Showing top {leaderboard.length} scores • Only your highest score per topic counts
        </div>
      )}
    </div>
  )
}

export default Leaderboard