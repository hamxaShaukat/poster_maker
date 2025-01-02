import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ImageState {
    img: string;
    setImg: (img: string) => void;
}

const useImg = create<ImageState>()(
    persist(
        (set) => ({
            img: '',
            setImg: (img: string) => set({ img }),
        }),
        {
            name: 'img-storage',
            storage: {
                getItem: (img) => {
                    const item = localStorage.getItem(img);
                    return item ? JSON.parse(item) : null;
                },
                setItem: (img, value) => localStorage.setItem(img, JSON.stringify(value)),
                removeItem: (img) => localStorage.removeItem(img),
            },
        }
    )
);

export default useImg;