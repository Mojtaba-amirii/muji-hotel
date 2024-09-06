export { default } from "next-auth/middleware";

// export const config = {
//   matcher: ["/user/:path*", "/api/:path*"],
// };

export const config = {
  matcher: ["/user/:path*"],
};
