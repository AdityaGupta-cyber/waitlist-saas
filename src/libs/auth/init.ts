import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import Passwordless from "supertokens-node/recipe/passwordless";
import { eq } from "drizzle-orm";
import { organisation } from "../../../drizzle/schema";
import { db } from "../../server";


export const initSuperTokens = () => {
    supertokens.init({
      supertokens: {
        connectionURI: "https://st-dev-d7a47fc0-0d67-11f0-92b9-259bfedb9391.aws.supertokens.io",
        apiKey: "W6XkDfvrJKzrqJr50kbNxeUV-w",
      },
      appInfo: {
        appName: "Ather",
        apiDomain: "http://localhost:3000",
        websiteDomain: "http://localhost:5173",
        websiteBasePath: "/auth",
      },
      recipeList: [
        Passwordless.init({
          contactMethod: "EMAIL",
          flowType: "MAGIC_LINK",
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                consumeCode: async (input) => {
                  const response = await originalImplementation.consumeCode(input);
  
                  if (response.status === "OK") {
                    const { id, emails } = response.user;
                    console.log(`response: ${JSON.stringify(response)}`);
  
                    if (
                      input.session === undefined &&
                      response.createdNewRecipeUser &&
                      response.user.loginMethods.length === 1
                    ) {
                      const email = emails[0];
                      console.log(`email: ${email}`);
  
                      const newOrg = await (await db).insert(organisation).values({ id, email });
                      console.log(`newOrg: ${JSON.stringify(newOrg)}`);
                    
                    } else {
                      let checkOrg = await (await db)
                        .select()
                        .from(organisation)
                        .where(eq(organisation.email, emails[0]));
                      console.log(`checkOrg: ${JSON.stringify(checkOrg)}`);
  
                      if (checkOrg.length === 0) {
                        try {
                          const newOrg = await (await db)
                            .insert(organisation)
                            .values({ id, email: emails[0] })
                            .returning({
                              id: organisation.id,
                              email: organisation.email,
                            });
                          console.log(`newOrg: ${JSON.stringify(newOrg)}`);
                        } catch (err) {
                          console.log(`err: ${err}`);
                        }
                      }
                     
                      
                      return response;
                    }
                  }
  
                  return response;
                },
              };
            },
          },
        }),
        Session.init(),
      ],
    });
  };