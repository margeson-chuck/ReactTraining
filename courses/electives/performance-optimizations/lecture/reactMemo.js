import * as React from 'react'
import Heading from 'YesterTech/Heading'

export default function App() {
  const [count, setCount] = React.useState(0)

  const onUpdate = React.useCallback(() => {
    console.log('User was updated')
  }, [])

  const [user, setUser] = React.useState({})

  return (
    <div className="align-center spacing">
      <Heading size={4}>Parent Component (App)</Heading>
      <button className="button" onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <hr />
      <UserProfile user={user} onUpdate={onUpdate} />
    </div>
  )
}

const UserProfile = React.memo(() => {
  console.log('render')
  return (
    <div>
      <Heading size={4}>Child Component (UserProfile)</Heading>
      <p className="text-small">
        Check the console to see how many times I render when the parent state changes
      </p>
    </div>
  )
})
