
export const SET_TITLE = 'SET_TITLE';


export function changeTitleAction(title) {
  return { type: SET_TITLE, payload: { title } };
}
