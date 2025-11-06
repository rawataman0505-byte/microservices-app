import { useDispatch, useSelector, shallowEqual } from 'react-redux'

// Small wrappers for convenience
export const useAppDispatch = () => useDispatch()
export const useAppSelector = (selector) => useSelector(selector, shallowEqual)

export default { useAppDispatch, useAppSelector }
