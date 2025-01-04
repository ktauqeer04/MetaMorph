import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';


const isPublicAPIRoute = createRouteMatcher([
    "/api/videos"
])

const isPublicRoute = createRouteMatcher([
    "/signin",
    "/signup",
    "/",
    "/home"
])

export default clerkMiddleware( async (auth, req) => {
    const { userId } = await auth();
    const currentURL = new URL(req.url);
    const isAccessingHomePage = currentURL.pathname === "/home";
    const isApiRequest = currentURL.pathname.startsWith("/api");

    // if logged in and trying to access /signin and /signup page
    if(userId && isPublicRoute(req) && !isAccessingHomePage){
        return NextResponse.redirect(new URL("/home", req.url));
    }

//****************************************************************************************************************
    //http://fileExample.com/api/auth/signin/home
    //http://fileExample.com/home
//*********************************************************************************************************** */



    // if not logged in and trying to access 
    if(!userId){

        //trying to access routes that are not public 
        if(!isPublicRoute(req) && !isPublicAPIRoute(req)){
            const temp = new URL("/signin", req.url);
            return NextResponse.redirect(new URL("/signin", req.url));
        }

        // trying to access api route that is not public
        if(isApiRequest && !isPublicAPIRoute){
            // console.log(`req.url is = ${req.url}`);
            return NextResponse.redirect(new URL("/signin", req.url));
        }

    }

    return NextResponse.next();

})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};