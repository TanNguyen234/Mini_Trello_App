import { useRoutes } from "react-router-dom";
import { routes } from "../../routers/index"

function AllRoutes() {
    const elements = useRoutes(routes);    
    return <>
        {elements}
    </>
}

export default AllRoutes;