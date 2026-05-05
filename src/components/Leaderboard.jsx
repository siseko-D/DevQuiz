import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const topics = ['All', 'HTML', 'CSS', 'JavaScript', 'React', 'Python', 'Java']

  useEffect(() => {
    fetchLeaderboard()
  }, [selectedTopic])

  const fetchLeaderboard = async () => {
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
      // If tie, keep the most recent
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
        .slice(0, 20)
      
      setLeaderboard(combinedData)
      
    } catch (err) {
      console.error("Error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="leaderboard-title">
          <span className="title-icon">🏆</span>
          <h1>Leaderboard</h1>
        </div>
        <p className="leaderboard-subtitle">Top performers across all quizzes (highest scores only)</p>
      </div>

      <div className="topic-filters">
        {topics.map(topic => (
          <button
            key={topic}
            className={`topic-filter-btn ${selectedTopic === topic ? 'active' : ''}`}
            onClick={() => setSelectedTopic(topic)}
          >
            {topic === 'All' ? '🌟 All Topics' : topic}
          </button>
        ))}
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
                  <span className="user-topic">{entry.topic}</span>
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
    </div>
  )
}

export default Leaderboard