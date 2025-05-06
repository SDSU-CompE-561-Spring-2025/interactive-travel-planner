export default function SignInForm() {

    return (
        <div className="rounded-lg border bg-background p-4 shadow-sm">
            <h1>Sign In</h1>
            <form>
                <div className = "mb-4">
                    <label htmlFor="username">Username:</label>
                    <input className="bg-amber-50"
                        type="username"
                        id="username"
                        name="username"
                        required
                        />
                </div>
                <div className = "mb-4">
                    <label htmlFor="password">Password:</label>
                    <input className ="bg-amber-50"
                        type="password"
                        id="password"
                        name="password"
                        required
                        />
                </div>

                <div className="p-5 bg-amber-300">
                    <button className="bg-amber-300 hover:bg-amber-300 text-white font-bold py-2 px-4 rounded"
                    type="submit"> Sign In</button>
                </div>
            </form>
        </div>
    );
}
