import { Header } from "../components/header.js"
import { Footer } from "../components/footer.js";
import RecipeMaker from "../components/RecipeMaker.js"
import { useAuth } from '../AuthContext.js';

function RecipeBuilder() {
    const { isLoggedIn } = useAuth();
    return (
        <div>
            <Header /><br/><br/><br/><br/>
            {isLoggedIn ? (
                <RecipeMaker />
            ) : (
                <h1>You must be logged in to create recipes.</h1>
            )}
        </div>
    );
}

export default RecipeBuilder