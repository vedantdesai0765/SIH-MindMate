import React, { useState, useMemo } from "react";

export default function PeerSupportForum() {
  const colors = {
    mutedBrown: "#5a4a3c",
    pastelYellow: "#fdf6e3",
    gentleGreen: "#e6f0e6",
    accentGreen: "#8a9a8a",
    accentYellow: "#d4bca1",
  };

  // mock user
  const [isModerator] = useState(true);

  // sample posts
  const initialPosts = [
    {
      id: 1,
      author: "An anonymous student",
      title: "Coping with exam anxiety — tips?",
      content:
        "Feeling overwhelmed during midterms. Any techniques that helped you calm down before an exam?",
      topic: "Exam Stress",
      time: "2h ago",
      replies: 4,
      upvotes: 12,
      anonymous: true,
      resolved: false,
    },
    {
      id: 2,
      author: "Riya (Peer Volunteer)",
      title: "Managing sleep schedule while studying",
      content:
        "I used simple sleep hygiene steps and short naps — helped me a lot. Share routines that worked for you.",
      topic: "Sleep",
      time: "1d ago",
      replies: 6,
      upvotes: 22,
      anonymous: false,
      resolved: false,
      volunteer: true,
    },
    {
      id: 3,
      author: "Sarthak",
      title: "Feeling low after project rejection",
      content:
        "I got rejected from a research internship and feeling demotivated. Looking for ways to bounce back.",
      topic: "Motivation",
      time: "3d ago",
      replies: 2,
      upvotes: 8,
      anonymous: false,
      resolved: true,
    },
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("All");
  const [showNewModal, setShowNewModal] = useState(false);

  // chat state
  const [chatMessages, setChatMessages] = useState([
    { user: "Riya", text: "Hi everyone 👋" },
    { user: "Anonymous", text: "Feeling a bit stressed today..." },
  ]);
  const [chatInput, setChatInput] = useState("");

  const topics = useMemo(() => {
    const s = new Set(posts.map((p) => p.topic));
    return ["All", ...Array.from(s)];
  }, [posts]);

  function handleUpvote(id) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p)));
  }

  function handleResolve(id) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, resolved: true } : p)));
  }

  function handleDelete(id) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleCreate(newPost) {
    const id = Math.max(...posts.map((p) => p.id)) + 1;
    setPosts((prev) => [{ id, ...newPost }, ...prev]);
    setShowNewModal(false);
  }

  function sendMessage() {
    if (chatInput.trim() === "") return;
    setChatMessages([...chatMessages, { user: "You", text: chatInput }]);
    setChatInput("");
  }

  const filtered = posts.filter((p) => {
    const inTopic = topicFilter === "All" || p.topic === topicFilter;
    const inQuery = [p.title, p.content, p.author, p.topic].join(" ").toLowerCase().includes(query.toLowerCase());
    return inTopic && inQuery;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5dc", fontFamily: "Segoe UI, Arial, sans-serif" }}>
      <style>{`
        .layout { display:flex; gap:24px; padding:28px; }
        .sidebar-card { width:260px; background:${colors.gentleGreen}; border-radius:14px; padding:20px; box-shadow:0 6px 18px rgba(0,0,0,0.06); color:${colors.mutedBrown};}
        .logo { font-weight:700; font-size:20px; color:${colors.mutedBrown}; margin-bottom:12px }
        .section-title { font-size:12px; letter-spacing:0.06em; color:${colors.accentGreen}; margin-top:18px; margin-bottom:10px }
        .nav-link { display:flex; gap:10px; align-items:center; padding:8px; border-radius:8px; color:${colors.mutedBrown}; text-decoration:none }
        .nav-link:hover { background:${colors.accentYellow} }

        .main { flex:1; display:flex; gap:20px }
        .top-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px }
        .page-title { font-size:28px; color:${colors.mutedBrown}; margin:0 }
        .subtitle { color:${colors.accentGreen}; margin:8px 0 20px 0 }

        .controls { display:flex; gap:12px; align-items:center }
        .search { padding:8px 12px; width:220px; border-radius:8px; border:1px solid ${colors.accentGreen}; background:white }
        .filter { padding:8px 12px; border-radius:8px; border:1px solid ${colors.accentGreen}; background:white }
        .new-btn { padding:8px 14px; background:${colors.mutedBrown}; color:white; border-radius:8px; cursor:pointer }

        .post-list { flex:1 }
        .post-card { display:flex; gap:18px; background:white; padding:16px; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.04); margin-bottom:14px; align-items:flex-start }
        .post-title { font-weight:700; color:${colors.mutedBrown}; margin:0 0 6px }
        .post-content { color:#4b4b4b; margin:6px 0 }
        .tag { display:inline-block; padding:6px 8px; border-radius:999px; background:${colors.pastelYellow}; color:${colors.mutedBrown}; font-size:12px; margin-right:8px }
        .small-btn { padding:6px 10px; border-radius:8px; border:1px solid ${colors.accentGreen}; background:transparent; cursor:pointer }
        .upvote { background:${colors.accentGreen}; color:white; border:none }
        .resolved-badge { background:${colors.accentYellow}; color:${colors.mutedBrown}; padding:6px 8px; border-radius:8px; font-weight:600 }
        .moderator-controls { margin-left:auto; display:flex; gap:8px }

        .chat-area { width:300px; background:${colors.gentleGreen}; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); padding:16px; display:flex; flex-direction:column }
        .chat-area h3 { margin-top:0; color:${colors.mutedBrown}; }
        .chat-box { flex:1; max-height:400px; overflow-y:auto; background:#fff; border-radius:8px; padding:10px; margin-bottom:10px }
        .chat-message { margin-bottom:8px; font-size:14px }
        .chat-input { display:flex; gap:8px }
        .chat-input input { flex:1; padding:8px; border-radius:6px; border:1px solid #ccc }
        .chat-input button { padding:8px 12px; border:none; border-radius:6px; background:${colors.accentGreen}; color:white; cursor:pointer }

        .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.35); display:flex; justify-content:center; align-items:center }
        .modal { width:680px; background:white; padding:18px; border-radius:12px }
        .form-row { margin-bottom:10px }
        .input, textarea { width:100%; padding:8px 10px; border-radius:8px; border:1px solid ${colors.accentGreen} }
      `}</style>

      <div className="layout">
        <aside className="sidebar-card" aria-label="Sidebar">
          <div className="logo">MindMate</div>

          

          <div style={{ marginTop: 18 }}>
            <div className="section-title">PEER VOLUNTEERS</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 999, background: colors.accentGreen }}></div>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.mutedBrown }}>Riya</div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="post-list">
            <div className="top-row">
              <div>
                <h2 className="page-title">Peer Support Forum</h2>
                <div className="subtitle">Moderated peer-to-peer support with trained student volunteers</div>
              </div>

              <div className="controls">
                <input className="search" placeholder="Search topics, messages, volunteers..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="filter" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
                  {topics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button className="new-btn" onClick={() => setShowNewModal(true)}>+ New Post</button>
              </div>
            </div>

            <section aria-live="polite">
              {filtered.length === 0 && <div>No posts found</div>}
              {filtered.map((p) => (
                <article key={p.id} className="post-card" role="article" aria-labelledby={`post-${p.id}`}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 56, height: 56, borderRadius: 10, background: colors.pastelYellow }} />
                      <div>
                        <h3 id={`post-${p.id}`} className="post-title">{p.title}</h3>
                        <div style={{ fontSize: 13, color: "#666" }}>{p.anonymous ? "Anonymous" : p.author} • {p.time}</div>
                      </div>
                      <div className="moderator-controls">
                        {p.resolved && <div className="resolved-badge">Resolved</div>}
                        {isModerator && !p.resolved && (
                          <button className="small-btn" onClick={() => handleResolve(p.id)}>Mark Resolved</button>
                        )}
                        {isModerator && (
                          <button className="small-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                        )}
                      </div>
                    </div>

                    <div className="post-content">{p.content}</div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span className="tag">{p.topic}</span>
                        <span style={{ color: "#777", fontSize: 13 }}>{p.replies} replies</span>
                      </div>

                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button className="small-btn upvote" onClick={() => handleUpvote(p.id)}>▲ {p.upvotes}</button>
                        <button className="small-btn">Reply</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>

          {/* chat area */}
          <aside className="chat-area">
            <h3>Live Chat</h3>
            <div className="chat-box">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="chat-message">
                  <strong>{msg.user}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." />
              <button onClick={sendMessage}>Send</button>
            </div>
          </aside>
        </main>
      </div>

      {/* New Post Modal */}
      {showNewModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h3 style={{ marginTop: 0 }}>Create New Post</h3>
            <div className="form-row">
              <input className="input" placeholder="Title" id="np-title" />
            </div>
            <div className="form-row">
              <select className="input" id="np-topic">
                <option>Exam Stress</option>
                <option>Sleep</option>
                <option>Motivation</option>
              </select>
            </div>
            <div className="form-row">
              <textarea placeholder="Write your message..." rows={5} className="input" id="np-content" />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="small-btn" onClick={() => setShowNewModal(false)}>Cancel</button>
              <button
                className="new-btn"
                onClick={() => {
                  const title = document.getElementById("np-title").value || "(No title)";
                  const topic = document.getElementById("np-topic").value;
                  const content = document.getElementById("np-content").value || "";
                  handleCreate({ author: "You", title, topic, content, time: "now", replies: 0, upvotes: 0, anonymous: false, resolved: false });
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
