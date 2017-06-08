
const initialState = {
	features : []
}

export default (state = initialState, action) => {
	switch(action.type){
		case 'ADD_FEATURE':
			return {...state, features : [...state.features, action.payload]}
		default:
			return state;
	}
}