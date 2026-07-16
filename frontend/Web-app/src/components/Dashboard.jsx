import './Dashboard.css'
export default function Dashboard() {
    return (<>
        <h1 className="titulo__dashboard">Dashboard de incidencias</h1>
        <p className="texto__complementario">Aquí vas a poder ver estadísticas descriptivas y predictivas</p>
        <iframe
            title="Dashboard"
            width="100%"
            height="90%"
            src="https://app.powerbi.com/view?r=eyJrIjoiYTcxNzFiYzQtYjgwZi00YjdhLWFhMDUtNGQ3MTE4ZDBmNzhmIiwidCI6ImM0YTY2YzM0LTJiYjctNDUxZi04YmUxLWIyYzI2YTQzMDE1OCIsImMiOjR9"
            frameBorder="0"
            allowFullScreen={true}
            style={{ border: '2px solid black', borderRadius: '10px' }}
        />
    </>)
}