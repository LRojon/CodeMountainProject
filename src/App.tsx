import { Chart, LineController, BarController, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
//import Chart from 'chart.js/auto'
import { useEffect, useRef } from 'react';
import './App.css';

Chart.register(LineController, BarController, CategoryScale, LinearScale, BarElement, PointElement, LineElement)
const WIDTH = Math.floor(window.innerWidth * 0.95)
const HEIGHT = Math.floor(window.innerHeight * 0.98)

const getData = async () => {
    const response = await fetch('http://http://srv-glpi/front/ticket.php')
    return await response.text()
}

const App = () => {
    //const [content, setContent] = useState('')
    //const [refresh, setRefresh] = useState(true)
    const container = useRef<HTMLDivElement | null>(null)

    const makeArray = (content: string, uniqueConsecutiveValue: boolean = true, withEmptyLine: boolean = false): number[] => {
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
            //ret.push(line.length)
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

        ret.push(ret[0])
        return ret
    }

    const makeMountain = (values: number[]): SVGElement => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        svg.setAttribute("width", WIDTH.toString());
        svg.setAttribute("height", HEIGHT.toString());
        svg.setAttribute("viewbox", "0 0 " + WIDTH + " " + HEIGHT)

        let coordMountain = ""
        let x= 0
        const stepX = Math.floor(WIDTH / (values.length - 2))
        const stepY = Math.floor(HEIGHT / (Math.max(...values))) - 5
        console.log("Step: " + stepX + ", " + stepY)
        for(const y of values) {
            coordMountain += x * stepX + " " + (HEIGHT - y * stepY) + ", ";
            x++
        }

        // create a polygon
        const mountain = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        mountain.setAttribute("points", coordMountain); // test : "0 0, 30 65, 130 100, 200 150, 100 30, 65 20, 0 0"
        mountain.setAttribute("fill", "red");
        // attach it to the container
        svg.appendChild(mountain);

        x = 0;
        for(const y of values) {
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            dot.setAttribute('cx', (x * stepX).toString())
            dot.setAttribute('cy', (HEIGHT - y * stepY).toString())
            dot.setAttribute('r', '5')
            dot.setAttribute('fill', 'white')
            dot.setAttribute('stroke', 'darkred')
            dot.setAttribute('stroke-width', '2')
            svg.appendChild(dot)

            x++
        }

        return svg
    }

    useEffect(() => {
        getData().then(txt => {
            let mountain: number[] = []
            mountain = makeArray(txt)

            if(container.current) {
                if(container.current.firstChild) { container.current.removeChild(container.current.firstChild) }
                container.current.appendChild(makeMountain(mountain))
            }
        })
    }, [])

    return (
        <div id='container' ref={container} className="App">
            {/*}<button onClick={() => {setRefresh(!refresh); change.current = true}} >{change.current ? "Refresh" : "Start"}</button><br/>*/}
        </div>
    );
}

export default App;
