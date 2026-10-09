import React, { useEffect, useState } from "react";
import {
  Heart,
  Calendar,
  Target,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { getTargetCountdown } from "../redux/slicer/targetSlice";

const DashboardBanner = () => {
  const dispatch = useDispatch();

  // =====================================================
  // TARGET COUNTDOWN FROM REDUX
  // =====================================================

  const { target, loading, error } = useSelector(
    (state) => state.target
  );

  // =====================================================
  // COUNTDOWN STATE
  // =====================================================

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // =====================================================
  // GET TARGET COUNTDOWN FROM BACKEND
  // =====================================================

  useEffect(() => {
    dispatch(getTargetCountdown());
  }, [dispatch]);

  // =====================================================
  // SET INITIAL COUNTDOWN FROM BACKEND
  // =====================================================

  useEffect(() => {
    if (!target?.remaining) return;

    setTimeLeft({
      days: Number(target.remaining.days) || 0,
      hours: Number(target.remaining.hours) || 0,
      minutes: Number(target.remaining.minutes) || 0,
      seconds: Number(target.remaining.seconds) || 0,
    });
  }, [target]);

  // =====================================================
  // LIVE COUNTDOWN
  // =====================================================

  useEffect(() => {
    if (!target?.remaining) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        // -----------------------------------------------
        // Seconds
        // -----------------------------------------------

        if (prev.seconds > 0) {
          return {
            ...prev,
            seconds: prev.seconds - 1,
          };
        }

        // -----------------------------------------------
        // Minutes
        // -----------------------------------------------

        if (prev.minutes > 0) {
          return {
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59,
          };
        }

        // -----------------------------------------------
        // Hours
        // -----------------------------------------------

        if (prev.hours > 0) {
          return {
            ...prev,
            hours: prev.hours - 1,
            minutes: 59,
            seconds: 59,
          };
        }

        // -----------------------------------------------
        // Days
        // -----------------------------------------------

        if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }

        // -----------------------------------------------
        // Countdown finished
        // -----------------------------------------------

        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  // =====================================================
  // FORMAT EXAM DATE
  // =====================================================

  const formatExamDate = (date) => {
    if (!date) return "NEET Exam";

    const examDate = new Date(date);

    if (Number.isNaN(examDate.getTime())) {
      return "NEET Exam";
    }

    return examDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT CURRENT TARGET DATE
  // =====================================================

  const formatCurrentDate = () => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // VALUES
  // =====================================================

  const examDate = target?.examDate
    ? formatExamDate(target.examDate)
    : "4 February 2028";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

      {/* =====================================================
          LEFT WELCOME CARD
      ===================================================== */}

      <div className="lg:col-span-2 bg-[#FDF2F8] rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm border border-pink-100">

        <div className="z-10 md:w-2/3">

          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Kya haal meri{" "}
            <span className="text-[#8B5CF6]">
              pyaari future doctor
            </span>{" "}
            behan? 💖
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Aap doctor bano na bano, par ye journey se aap ek
            competitor student ban jaoge, bahut kuchh sikhoge aur
            apne aap ko ek better insaan banaoge. Proud of you! ✨
          </p>

          <div className="flex gap-2">

            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-[#8B5CF6] shadow-sm">
              Dream Big
            </span>

            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-[#8B5CF6] shadow-sm">
              Stay Focused
            </span>

          </div>
        </div>

        {/* =====================================================
            ILLUSTRATION AREA
        ===================================================== */}

        <div className="relative w-full md:w-1/3 h-40 md:h-48 mt-4 md:mt-0 flex justify-center items-end">

          <img
            src="https://img.freepik.com/free-vector/hand-drawn-student-girl-studying_23-2148193541.jpg?w=740&t=st=1698765432~exp=1698766032~hmac=abcdef"
            alt="Study Girl"
            className="h-full object-contain drop-shadow-xl mix-blend-multiply"
          />

          {/* Floating Dream Plan Card */}

          <div className="absolute top-0 right-0 bg-white p-2 rounded-xl shadow-lg text-xs font-bold text-pink-500 rotate-6">
            Dream Plan
            <br />
            Start Small
          </div>

          {/* Coffee */}

          <div className="absolute bottom-4 right-10 bg-white p-2 rounded-xl shadow-lg text-xl">
            ☕
          </div>

        </div>
      </div>

      {/* =====================================================
          RIGHT COUNTDOWN CARD
      ===================================================== */}

      <div className="bg-[#FCE7F3] rounded-3xl p-5 border border-pink-200 shadow-sm flex flex-col justify-between">

        {/* Top */}

        <div className="flex justify-between items-start mb-4">

          <div className="bg-white/60 p-2 rounded-xl text-xs font-semibold flex items-center gap-1">
            <Calendar size={14} />

            {formatCurrentDate()}
          </div>

          <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center">

            <Heart
              size={16}
              className="text-pink-600 fill-pink-600"
            />

          </div>

        </div>

        {/* Target */}

        <div className="text-center mb-4">

          <h2 className="text-2xl font-extrabold text-[#BE185D] mb-1">
            Target 2028 NEET
          </h2>

        </div>

        {/* =====================================================
            COUNTDOWN
        ===================================================== */}

        <div className="grid grid-cols-4 gap-2 mb-4">

          {[
            {
              label: "Days",
              val: timeLeft.days,
            },
            {
              label: "Hours",
              val: timeLeft.hours,
            },
            {
              label: "Mins",
              val: timeLeft.minutes,
            },
            {
              label: "Secs",
              val: timeLeft.seconds,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-2 text-center shadow-sm"
            >

              <div className="text-lg font-bold text-slate-800">
                {loading ? "--" : item.val}
              </div>

              <div className="text-[10px] text-slate-500 uppercase">
                {item.label}
              </div>

            </div>
          ))}

        </div>

        {/* =====================================================
            TARGET EXAM
        ===================================================== */}

        <div className="bg-white/80 rounded-xl p-2 text-center text-xs font-medium text-slate-600 flex items-center justify-center gap-2">

          <Target
            size={14}
            className="text-pink-500"
          />

          Target Exam: {examDate} (NEET)

        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <p className="text-center text-[10px] text-red-500 mt-2">
            {error}
          </p>
        )}

      </div>
    </div>
  );
};

export default DashboardBanner;