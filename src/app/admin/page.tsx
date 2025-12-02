"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Admin() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('leaderboard').select('*').order('id');
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  const generateFlower = async (id: number, level: number) => {
    setLoading(true);
    try {
      // Call your API
      const res = await fetch('/api/generate-flower', {
        method: 'POST',
        body: JSON.stringify({ employeeId: id, level: level || 1 }),
      });
      const data = await res.json();
      if(data.success) alert("Flower Generated!");
      else alert("Error: " + JSON.stringify(data));
    } catch (e) {
      alert("Failed to connect to API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Garden Admin</h1>
      
      {loading && <div className="fixed top-0 left-0 w-full h-full bg-black/50 text-white flex items-center justify-center text-2xl z-50">GENERATING... PLEASE WAIT...</div>}

      <div className="grid gap-4">
        {users.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{u.name}</h2>
              <p className="text-gray-600">Level {u.level} • {u.kcal_current} / {u.kcal_goal} kcal</p>
              <p className="text-xs mt-1 text-blue-500">{u.flower_data ? "Has Flower ✅" : "No Flower ❌"}</p>
            </div>
            
            <button 
              onClick={() => generateFlower(u.id, u.level)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Generate AI Flower
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}