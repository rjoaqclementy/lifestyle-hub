import React from 'react';

interface ProfileFormProps {
  data: {
    full_name: string;
    username: string;
    bio: string;
    city: string;
    country: string;
    gender: string;
    interests: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProfileForm = ({ data, onChange }: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          type="text"
          name="full_name"
          value={data.full_name}
          onChange={onChange}
          placeholder="Full Name"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
        />
        <input
          type="text"
          name="username"
          value={data.username}
          onChange={onChange}
          placeholder="Username"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
        />
      </div>

      <textarea
        name="bio"
        value={data.bio}
        onChange={onChange}
        placeholder="Write something about yourself..."
        rows={3}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={data.city}
            onChange={onChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={data.country}
            onChange={onChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Gender
        </label>
        <select
          name="gender"
          value={data.gender}
          onChange={onChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Interests (comma-separated)
        </label>
        <input
          type="text"
          name="interests"
          value={data.interests}
          onChange={onChange}
          placeholder="e.g., sports, music, travel"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#573cff]/50 focus:border-[#573cff]"
        />
      </div>
    </div>
  );
};

export default ProfileForm;