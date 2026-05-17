import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginAPI, registerAPI, getMentorProfile, getCandidateProfile } from '../services/api';

const getSafe = (key) => {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
};

const getInitialState = () => {
    const stored = localStorage.getItem('guruconnect-auth');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed?.state) return parsed.state;
        } catch {}
    }
    return {
        user: getSafe('guruconnect-user'),
        token: localStorage.getItem('guruconnect-token') || null,
        mentorProfile: getSafe('guruconnect-mentor-profile'),
        candidateProfile: getSafe('guruconnect-candidate-profile'),
    };
};

const useAuthStore = create(
    persist(
        (set, get) => ({
            ...getInitialState(),

            login: async (email, password) => {
                const response = await loginAPI({ email, password });
                const { token, user } = response.data;

                localStorage.setItem('guruconnect-token', token);
                localStorage.setItem('guruconnect-user', JSON.stringify(user));

                let mentorProfileData = null;
                let candidateProfileData = null;
                if (user.role === 'mentor') {
                    try {
                        const profileRes = await getMentorProfile();
                        mentorProfileData = profileRes.data.mentor;
                        localStorage.setItem('guruconnect-mentor-profile', JSON.stringify(mentorProfileData));
                    } catch { mentorProfileData = null; }
                } else if (user.role === 'candidate') {
                    try {
                        const profileRes = await getCandidateProfile();
                        candidateProfileData = profileRes.data.candidate;
                        localStorage.setItem('guruconnect-candidate-profile', JSON.stringify(candidateProfileData));
                    } catch { candidateProfileData = null; }
                }

                set({ token, user, mentorProfile: mentorProfileData, candidateProfile: candidateProfileData });
                return user;
            },

            register: async (name, email, password, role) => {
                const response = await registerAPI({ name, email, password, role });
                const { token, user } = response.data;

                localStorage.setItem('guruconnect-token', token);
                localStorage.setItem('guruconnect-user', JSON.stringify(user));

                let mentorProfileData = null;
                let candidateProfileData = null;
                if (role === 'mentor') {
                    try {
                        const profileRes = await getMentorProfile();
                        mentorProfileData = profileRes.data.mentor;
                        localStorage.setItem('guruconnect-mentor-profile', JSON.stringify(mentorProfileData));
                    } catch { mentorProfileData = null; }
                } else if (role === 'candidate') {
                    try {
                        const profileRes = await getCandidateProfile();
                        candidateProfileData = profileRes.data.candidate;
                        localStorage.setItem('guruconnect-candidate-profile', JSON.stringify(candidateProfileData));
                    } catch { candidateProfileData = null; }
                }

                set({ token, user, mentorProfile: mentorProfileData, candidateProfile: candidateProfileData });
                return user;
            },

            logout: () => {
                localStorage.removeItem('guruconnect-token');
                localStorage.removeItem('guruconnect-user');
                localStorage.removeItem('guruconnect-mentor-profile');
                localStorage.removeItem('guruconnect-candidate-profile');
                set({ token: null, user: null, mentorProfile: null, candidateProfile: null });
            },

            setMentorProfile: (profile) => {
                localStorage.setItem('guruconnect-mentor-profile', JSON.stringify(profile));
                set({ mentorProfile: profile });
            },

            setCandidateProfile: (profile) => {
                localStorage.setItem('guruconnect-candidate-profile', JSON.stringify(profile));
                set({ candidateProfile: profile });
            },

            setUser: (updatedUser) => {
                localStorage.setItem('guruconnect-user', JSON.stringify(updatedUser));
                set({ user: updatedUser });
            },
        }),
        {
            name: 'guruconnect-auth',
            partialize: (state) => ({ token: state.token, user: state.user, mentorProfile: state.mentorProfile, candidateProfile: state.candidateProfile }),
        }
    )
);

export default useAuthStore;
