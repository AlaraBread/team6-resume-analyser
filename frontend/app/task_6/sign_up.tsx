"use client";

import { Button, Card, CardContent, CardHeader, Input } from "@mui/material";
import { useState } from "react";
import { backendPost} from "util/fetching";


export function SignUp(){
    const [postData, setPostData] = useState<string | undefined>();
    return (<>
        <Card>
        <CardHeader component="h2" title="Sign Up" />
				<CardContent>
					<p data-testid="backend-example-post">{postData}</p>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							const data = new FormData(
								event.target as HTMLFormElement,
							);
							backendPost("api/greeting", {
								name: data.get("name")?.toString() ?? "",
							})
								.then((data) => {
									setPostData(data.message);
								})
								.catch((reason) => {
									setPostData("" + reason);
								});
						}}
					>
						<Input name="email" placeholder="email" /><br/>
                        <Input name="username" placeholder="username" /><br/>
                        <Input name="password" placeholder="password" /><br/>
                        <Input name="confirm" placeholder="confirm password" /><br/>
                        <br/>
						<Button variant="contained" type="submit">
							sign up
						</Button>
					</form>
				</CardContent>
        </Card>
    </>);
}