* api

1. 流域名稱
    http://localhost:18099/Freq/Basins
    (1140:淡水河，1290:鳳山溪，1300:頭前溪...)

2. 各縣市名稱與代碼
    http://localhost:18099/Freq/County

3. 取得各縣市雨量站名稱與代碼
    (A:臺北市，B:臺中市，C:基隆市...)
    http://localhost:18099/Freq/RstInCounty/A

4. 取得中央管流域雨量站名稱與代碼
    http://localhost:18099/Freq/RstInBasin/1140

5. 取得雨量站歷年各延時年最大降雨量
    http://localhost:18099/Freq/RainIntensity/466920?authority=CWB

6. 卡方及KS檢定
    http://localhost:18099/Freq/StatisTest?data=261%2C79%2C311%2C222%2C708%2C364%2C607%2C147%2C480%2C78%2C226%2C447%2C381%2C152%2C507%2C394%2C274&probDist=N&confLevel=2

7. 水文頻率分析
    http://localhost:18099/Freq/FrequencyAnalysis?data=261%2C79%2C311%2C222%2C708%2C364%2C607%2C147%2C480%2C78%2C226%2C447%2C381%2C152%2C507%2C394%2C274&probDist=N

8. 統計檢定及水文頻率分析
    http://localhost:18099/Freq/ProbTestFreq?data=261%2C79%2C311%2C222%2C708%2C364%2C607%2C147%2C480%2C78%2C226%2C447%2C381%2C152%2C507%2C394%2C274&probDist=N&confLevel=2