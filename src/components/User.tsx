import getSession from "@/lib/getSession"

export default async function User() {
    const session = await getSession();

  return (
    <pre>{JSON.stringify(session)}</pre>
  )
}
