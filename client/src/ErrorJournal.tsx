import {useState, useReducer, useRef} from "react";
import './App.css';
import axios from 'axios'



export const ErrorJournal = () => {
	const [errors, setErrors] = useState<any[]>([]);
	const errorInfo = useRef(null)
	/*==========================
			UI STATE
	 ========================*/

	const [generationConfirmation, setGenerationConfirmation] = useState(false);
	const [storeConfirmation, setStoreConfirmation] = useState(false);

	/*==========================
			FIN DES UI STATE
	 ========================*/

	/*
	* ===========================================================
	* FONCTION POUR RECUPERER LES ERREURS GENEREES PAR LE BACK
	* ===========================================================
	* */
	const handleFetchErrors = async () => {
		const url = "http://127.0.0.1:8000/generate_error";
		try {
			const response = await axios.get<Error[]>(url);
			setErrors(response.data);
			setGenerationConfirmation(true);
			setTimeout(()=>{
				setGenerationConfirmation(false)
			},5000);
			console.log(response.data);
		} catch (err) {
			console.log(err);
		}
	};
	/*
        * ===========================================================
        * FIN FONCTION POUR RECUPERER LES ERREURS GENEREES PAR LE BACK
        * ===========================================================
        * */

	/*
        * ===========================================================
        * FONCTION POUR ENREGISTRER LES ERREURS DANS LA BDD
        * ===========================================================
        * */

		const storeErrors = async ()=>{
			const url = "http://127.0.0.1:8000/store_errors"

			if(errors.length > 0){
				try{
					await axios.post(url,errors).then(()=>{
						setStoreConfirmation(true)
						setTimeout(()=>{
							setStoreConfirmation(false)
						},5000);
					})

				}catch(err){
					console.log(err);
				}
			}else{
				errorInfo.current.innerText = "Veuillez générer des erreurs avant de les enregistrer !"
			}

		}

	/*
        * ===========================================================
        *FIN  FONCTION POUR ENREGISTRER LES ERREURS DANS LA BDD
        * ===========================================================
        * */




	return (
		<div className="error-journal">
			<h2>Journal des erreurs</h2>
			<button onClick={() =>handleFetchErrors()}>
				Générer des erreurs
			</button>
			{generationConfirmation && (
				<i className='bx bxs-check-square'></i>
			)}
			{errors.length > 0 ? (
				<ul>
					{errors.map((error, index) => (
						<li key={index}>
							<strong>{error.type}</strong> - {error.message} - Niveau : {error.level} - {error.timestamp}
						</li>
					))}
				</ul>
			) : (
				<p>Aucune erreur pour le moment</p>
			)}

			<button onClick={()=> storeErrors()}>
				Enregistrer les erreurs

			</button>
			<h5 ref={errorInfo}></h5>
			{storeConfirmation && (
				<i className='bx bxs-check-square'></i>
			)}
		</div>
	)
}

