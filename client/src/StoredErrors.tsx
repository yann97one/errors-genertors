import "./App.css"
import {useState, useEffect, useRef} from "react";
import axios from 'axios'

export const StoredErrors =  () => {
	//State pour mettre à jour  les erreurs qui seront récupérées grâce au back
	const [storedErrors, setStoredErrors] = useState<any[]>([]);
	//Constante faisant reference au websocket
	const socket = useRef(null);

	/*==========================
			    UI
	 ========================*/

	const [currentPage, setCurrentPage] = useState(1);
	const errorsPerPage = 10;

	const indexOfLastError = currentPage * errorsPerPage;
	const indexOfFirstError = indexOfLastError - errorsPerPage;
	const currentErrors = storedErrors.slice(indexOfFirstError, indexOfLastError);
	const totalPages = Math.ceil(storedErrors.length / errorsPerPage);


	const handleNextPage = () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	const handlePrevPage = () => {
		setCurrentPage((prevPage) => prevPage - 1);
	};

	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === Math.ceil(storedErrors.length / errorsPerPage);


	/*==========================
			FIN UI
	 ========================*/

	const sortSelector = useRef(null);
	useEffect(() => {
		//récupération des erreurs
		const fetchStoredErrors = async () => {
			const url = "http://127.0.0.1:8000/display_stored_errors";
			try {
				const response = await axios.get(url);
				setStoredErrors(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		  const socket = new WebSocket("ws://127.0.0.1:8000/ws");

		fetchStoredErrors();

		 return ()=>{
		 	socket.close();
		 };
	}, []);



	const formatTimestamp = (timestamp: string) => {
		const date = new Date(timestamp);
		return date.toLocaleString();
	};

	/*
	*
	* Fonction qui permet de mettre à jour avec un websocket le tableau d'erreur selon l'option de  tri que l'utilisateur à sélectionné
	*
	* */
	const refreshTab = () => {
		if (sortSelector.current && sortSelector.current.value != null) {
			if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
				// If the socket is not initialized or the connection is not open, create a new socket and open it
				socket.current = new WebSocket("ws://127.0.0.1:8000/ws");

				socket.current.onopen = () => {
					console.log("Connexion établie avec le WS");
				};

				socket.current.onmessage = (event) => {
					console.log("Message reçu du serv WS : ", event.data);
					const sortedErrors = JSON.parse(event.data)
					setStoredErrors(sortedErrors);
				};

				socket.current.onclose = () => {
					console.log("Connexion fermée avec le serveur WS");
				};
			}

			// Create an object with the data to send
			const dataToSend = { value: sortSelector.current.value };
			console.log("Message envoyé :", JSON.stringify(dataToSend));

			// Send the data to the server
			socket.current.send(JSON.stringify(dataToSend));
		}
	};









	return (
		<div className="error-journal">
			<h2>Erreurs enregistrées dans la base de données</h2>
			{storedErrors.length > 0 ? (

				<table className="table">
					<thead>
					<tr>
						<th scope="col">
							<select className={"form-select form-select-lg mb-3"} ref={sortSelector} onChange={()=>refreshTab()}>
								<option value={"default"}>Trier par</option>
								<option value={"type"}>Type</option>
								<option value={"level"}>Niveau</option>
							</select>
						</th>
						<th scope="col">Type</th>
						<th scope="col">Message</th>
						<th scope="col">Niveau</th>
						<th scope="col">Timestamp</th>
					</tr>
					</thead>
					<tbody>
					{currentErrors.map((error, index) => (
						<tr key={index}>
							<th scope="row">{error.id}</th>
							<td>{error.type}</td>
							<td>{error.message}</td>
							<td>{error.level}</td>
							<td>{formatTimestamp(error.timestamps)}</td>
						</tr>
					))}
					</tbody>
				</table>
			) : (
				<p>Aucune erreur enregistrée pour le moment</p>
			)}
			<div className={"button_container"}>
				<button onClick={handlePrevPage} disabled={isFirstPage}>
					<i className='bx bxs-left-arrow'></i>
				</button>
				<div className={"page_indicator"}>{currentPage}/{totalPages}</div>
				<button onClick={handleNextPage} disabled={isLastPage}>
					<i className='bx bxs-right-arrow'></i>
				</button>
			</div>
		</div>
	);
}