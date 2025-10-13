// src/pages/Counselors.jsx
import React, { useEffect, useState, useRef } from "react";
import "./styles/Counsellor.css"

const Counsellor = () => {
  const [counselors] = useState([
    {
      id: 1,
      name: "Dr. Evelyn Reed",
      img: "https://placehold.co/150x150/ADD8E6/5C4033?text=ER",
      specialization: "Cognitive Behavioral Therapy (CBT)",
      available: true,
      bio: "Dr. Reed specializes in helping individuals navigate anxiety and stress using evidence-based CBT techniques. With over 10 years of experience, she provides a compassionate and structured approach to mental wellness.",
      availability: { Mon: "9am - 5pm", Wed: "10am - 7pm", Fri: "9am - 3pm" },
    },
    {
      id: 2,
      name: "Marcus Thorne",
      img: "https://placehold.co/150x150/FFF9C4/5C4033?text=MT",
      specialization: "Mindfulness & Stress Reduction",
      available: true,
      bio: "Marcus is a certified mindfulness coach who integrates meditation and stress-reduction practices to help clients find balance and presence in their daily lives. He is known for his calm demeanor and practical guidance.",
      availability: { Tue: "1pm - 8pm", Thu: "1pm - 8pm" },
    },
    {
      id: 3,
      name: "Dr. Lena Petrova",
      img: "https://placehold.co/150x150/d1d5db/5C4033?text=LP",
      specialization: "Relationship Counseling",
      available: false,
      bio: "Dr. Petrova focuses on relationship dynamics, communication, and conflict resolution for couples and individuals. Her goal is to foster healthier connections and understanding.",
      availability: { Mon: "11am - 6pm", Tue: "9am - 2pm" },
    },
    {
      id: 4,
      name: "Samuel Chen",
      img: "https://placehold.co/150x150/8BC34A/FFFFFF?text=SC",
      specialization: "Life Transitions & Career Coaching",
      available: true,
      bio: "Sam helps clients navigate major life changes, from career shifts to personal milestones. He provides goal-oriented coaching to build resilience and create a fulfilling life path.",
      availability: { Wed: "8am - 12pm", Fri: "1pm - 5pm" },
    },
  ]);

  const [activeCounselor, setActiveCounselor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const [liveCall, setLiveCall] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  // === Helpers ===
  const getTodayISO = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const adjusted = new Date(today.getTime() - offset * 60 * 1000);
    return adjusted.toISOString().split("T")[0];
  };

  // === LocalStorage Management ===
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mindmate_appointments")) || [];
    setAppointments(saved);
  }, []);

  const saveAppointment = (appt) => {
    const updated = [...appointments, appt];
    setAppointments(updated);
    localStorage.setItem("mindmate_appointments", JSON.stringify(updated));
  };

  // === Toast ===
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  // === Video Call Logic ===
  const startLiveCall = (name) => {
    setLiveCall(true);
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
  };

  const endLiveCall = () => {
    clearInterval(timerRef.current);
    setLiveCall(false);
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  // === Booking Logic ===
  const handleConfirmBooking = (counselor, date, time) => {
    const newAppt = {
      id: Date.now(),
      counselorId: counselor.id,
      counselorName: counselor.name,
      date,
      time,
      createdAt: new Date().toISOString(),
    };
    saveAppointment(newAppt);
    showToast(`Appointment with ${counselor.name} confirmed!`);
    setActiveCounselor(null);
  };

  return (
    <div className="bg-primary-bg text-stone-800 font-sans antialiased min-h-screen">
      <div className="max-w-6xl mx-auto p-6 sm:p-10">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <a href="/home" className="flex items-center space-x-3 transition-transform duration-300 hover:scale-110">
            <span className="font-display text-2xl font-bold text-stone-800">
              MindMate Counselors
            </span>
          </a>
          <button
            onClick={() => setShowAppointments(true)}
            className="bg-accent-green text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            My Appointments
          </button>
        </header>

        {/* MAIN */}
        <main>
          <section id="counselor-directory">
            <h2 className="font-display text-3xl font-bold text-stone-800 mb-8 text-center">
              Our Counselors
            </h2>
            <p className="text-center text-stone-600 max-w-2xl mx-auto mb-12">
              Connect with our certified professionals. Browse their profiles and book a session that fits your schedule.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {counselors.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveCounselor(c)}
                  role="button"
                  tabIndex={0}
                  className="bg-[#fefef3] rounded-xl shadow-md p-5 text-center flex flex-col items-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                >
                  <img src={c.img} alt={c.name} className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-sm" />
                  <h3 className="font-display font-semibold text-lg">{c.name}</h3>
                  <p className="text-stone-600 text-sm mb-3">{c.specialization}</p>
                  <span
                    className={`inline-flex items-center rounded-full text-xs px-2 py-1 font-medium ${
                      c.available ? "bg-accent-green/10 text-accent-green" : "bg-stone-200/50 text-stone-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 mr-1.5 rounded-full ${
                        c.available ? "bg-accent-green" : "bg-stone-400"
                      }`}
                    ></span>
                    {c.available ? "Available" : "Offline"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Counselor Modal */}
      {activeCounselor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] relative">
            <button
              onClick={() => setActiveCounselor(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <img
                  src={activeCounselor.img}
                  alt={activeCounselor.name}
                  className="w-32 h-32 rounded-full mb-4 border-4 border-white shadow-lg"
                />
                <h2 className="font-display text-2xl font-bold">{activeCounselor.name}</h2>
                <p className="text-accent-brown font-medium">{activeCounselor.specialization}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-display text-lg font-semibold mb-2 border-b pb-1">About</h3>
                <p className="text-stone-600 mb-6">{activeCounselor.bio}</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => alert(`Simulating chat with ${activeCounselor.name}`)}
                    className="flex-1 bg-accent-blue/20 text-accent-brown font-semibold py-2 px-4 rounded-lg hover:bg-accent-blue/40 transition"
                  >
                    Chat Now
                  </button>
                  <button
                    onClick={() => startLiveCall(activeCounselor.name)}
                    className="flex-1 bg-accent-blue/20 text-accent-brown font-semibold py-2 px-4 rounded-lg hover:bg-accent-blue/40 transition"
                  >
                    Start Video Call
                  </button>
                  <button
                    onClick={() =>
                      handleConfirmBooking(activeCounselor, getTodayISO(), "02:00 PM")
                    }
                    className="flex-1 bg-accent-green text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Call */}
      {liveCall && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-stone-800/95 text-white">
          <div className="flex-grow flex items-center justify-center">
            <div className="relative text-center z-10 p-4 bg-black/20 rounded-lg">
              <h2 className="text-3xl font-bold">In call...</h2>
              <p className="text-lg text-stone-300 mt-1">{formatTime(timer)}</p>
            </div>
          </div>
          <div className="bg-stone-900/80 p-4 flex justify-center items-center gap-4 z-10">
            <button className="bg-red-600 p-4 rounded-full hover:bg-red-700" onClick={endLiveCall}>
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-accent-green text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300">
          {toastMsg}
        </div>
      )}

      {/* Appointments Modal */}
      {showAppointments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowAppointments(false)} className="absolute top-4 right-4 text-stone-500 hover:text-stone-800">
              ✕
            </button>
            <h2 className="font-display text-2xl font-bold mb-6 text-center">My Appointments</h2>
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <p className="text-center text-stone-500">You have no upcoming appointments.</p>
              ) : (
                appointments.map((appt) => (
                  <div key={appt.id} className="bg-stone-100 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">With {appt.counselorName}</p>
                      <p className="text-stone-600 text-sm">
                        {appt.date} at {appt.time}
                      </p>
                    </div>
                    <button
                      onClick={() => startLiveCall(appt.counselorName)}
                      className="bg-accent-blue/40 text-accent-brown py-1 px-3 rounded-md hover:bg-accent-blue/60 text-sm"
                    >
                      Join
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Counsellor;
