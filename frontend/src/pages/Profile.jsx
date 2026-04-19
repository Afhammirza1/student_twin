import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import SkillChart from "../components/SkillChart";

export default function Profile() {
  const { username } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get(`/public/${username}`);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [username]);

  if (!data) return <p className="p-6">Loading portfolio...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-4">
        {data.name}'s Portfolio
      </h1>

      {/* 🔥 SUMMARY */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <h3 className="font-semibold">AI Summary</h3>
        <p>{data.summary}</p>
      </div>

      {/* 🔥 READINESS */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <p>
          Readiness: <b>{data.readiness}%</b>
        </p>
      </div>

      {/* 🔥 CHART */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3>Skills</h3>
        <SkillChart skills={data.skills} />
      </div>

    </div>
  );
}
