export default function Slider() {
    return (
        <div>
            <div className="slidecontainer">
                <input type="range" min="1" max="100" value="50" id="myRange"/>
            </div>
        </div>
    );
}