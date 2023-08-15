import { ROWPOINTS } from '@/setup'
import { useEffect, useState } from 'react'


export const useGameStatus = (rowsCleared: number) => {
    const [score, setScore] = useState(0)
    const [rows, setRows] = useState(0)
    const [level, setLevel] = useState(1)

    useEffect(() => {
        if (rowsCleared > 0) {
            setScore(prev => prev + ROWPOINTS[rowsCleared - 1] * level)
            setRows(prev => prev + rowsCleared);

        }
    },[rowsCleared])

    return {score, setScore, rows, setRows, level, setLevel}
}