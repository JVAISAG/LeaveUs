import Admin from './admin'
import { Protected } from '../protected'

export default function Page(){
    return (
        // <Protected requiredRole='admin'>
            <Admin/>
        // </Protected>
    )
}