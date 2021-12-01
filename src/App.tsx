import { Chart, ChartData, LineController, BarController, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
//import Chart from 'chart.js/auto'
import { useEffect, useRef, useState } from 'react';
import './App.css';

Chart.register(LineController, BarController, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

const getData = async () => {
    const response = await fetch('../src/Data/Project.txt')
    return await response.text()
}

const App = () => {

    /*let content = "import './App.css';\n" +
"\n" +
"    const App = () => {\n" +
"    \n" +
"        const makeArray = (content: string): number[] => {\n" +
"            const strArray = content.split('\\n')\n" +
"    \n" +
"            let ret: number[] = []\n" +
"    \n" +
"            for(const line of strArray) {\n" +
"                let n = 0\n" +
"                for(const char of line) {\n" +
"                    if(char === ' ') { n += 1 }\n" +
"                    else { break; }\n" +
"                }\n" +
"                ret.push(n)\n" +
"            }\n" +
"            return ret\n" +
"        }\n" +
"    \n" +
"        return (\n" +
"            <div className=\"App\">\n" +
"            </div>\n" +
"        );\n" +
"    }\n" +
"    \n" +
"                            \n" +
"    export default App;"*/

    const [content, setContent] = useState('')
    const [refresh, setRefresh] = useState(true)
    const change = useRef(false)

    const makeArray = (content: string, uniqueConsecutiveValue: boolean = false, withEmptyLine: boolean = true): number[] => {
        const strArray = content.split('\n')

        let ret: number[] = []

        for(const line of strArray) {
            if(withEmptyLine) {
                let n = 0
                for(const char of line) {
                    if(char === ' ') { n += 1 }
                    else { break; }
                }
                ret.push(n)
            }
            else {
                if(line.trim() !== '') {
                    let n = 0
                    for(const char of line) {
                        if(char === ' ') { n += 1 }
                        else { break; }
                    }
                    ret.push(n)
                }
            }
        }
        ret.map((e, i) => { return ret[i] = Math.floor(e / 4) })
        
        if(uniqueConsecutiveValue) {
            let toDelete: number[] = []
            ret.map((e, i) => {
                if(i>= 1 && e === ret[i - 1]) {
                    toDelete.push(i)
                }
                return 0
            })
            
            for(let i = toDelete.length - 1; i >= 0; i--){
                ret.splice(toDelete[i], 1)
            }
        }
        return ret
    }

    const formatData = (data: number[]): ChartData => ({
        labels: Array.from(Array(data.length).keys()),
        datasets: [{
            data: data,
            backgroundColor: ['rgb(255,255, 255)'],
            borderColor: ['rgb(100,0,0)'],
            borderWidth: 2,
            tension: 0.2,
            fill: true
        }],
        
    })

    const chartRef = useRef<Chart | null>(null)
    let mountain: number[] = makeArray(content)

    const canvas = useRef<HTMLCanvasElement | null>(null)
    const canvasCtx = useRef<CanvasRenderingContext2D | null>(null)

    const canvasCallback = (canvas: HTMLCanvasElement | null) => {
        if(!canvas) return;

        const ctx = canvas.getContext('2d')
        if(ctx) {
            chartRef.current = new Chart(ctx, {
                type: "line",
                data: formatData(makeArray(content)),
                options: { 
                    responsive: true,
                    scales: {
                        yAxes: {
                            max: Math.max(...mountain) + 0.5,
                            ticks: {
                                stepSize: Math.max(...mountain) + 0.5
                            }
                        }
                    }
                }
            })
        }
    }

    useEffect(() => {
        
        getData().then(txt => setContent(txt))

        setTimeout(() => {
            mountain = makeArray(content)
            console.log(content);
            console.log(mountain);
            
    
            if(canvas.current) {
                canvasCtx.current = canvas.current.getContext('2d')
                const ctx = canvasCtx.current
                chartRef.current?.destroy()
                chartRef.current = new Chart(canvas.current, {
                    type: "line",
                    data: formatData(mountain),
                    options: { 
                        responsive: true,
                        scales: {
                            yAxes: {
                                max: Math.max(...mountain) + 0.5,
                                ticks: {
                                    stepSize: Math.max(...mountain) + 0.5
                                }
                            }
                        }
                    }
                })
            }
        }, 1000);
    }, [refresh])

    return (
        <div className="App">
            <button onClick={() => {setRefresh(!refresh); change.current = true}} >Refresh</button><br/>
            <canvas width={500} height={250} ref={canvas} ></canvas>
        </div>
    );
}

export default App;
