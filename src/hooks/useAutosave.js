import { useEffect } from 'react'
import { saveData } from '../utils/storage'

export default function useAutosave(data, interval = 1500) {
  useEffect(() => {
    const t = setTimeout(() => {
      saveData(data)
    }, interval)
    return () => clearTimeout(t)
  }, [data, interval])
}
