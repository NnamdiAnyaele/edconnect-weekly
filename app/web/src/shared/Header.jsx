
import React, { useState, useEffect } from "react"
import { Form, Button, Nav, Navbar } from "react-bootstrap"
import { useHistory } from "react-router-dom"

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState("")
  const history = useHistory()

  useEffect(() => {
    const cookie = document.cookie.match("(^|;)\\s*uid\\s*=\\s*([^;]+)")
    if (cookie) {
      fetch(`/api/users/${cookie.pop()}`)
        .then(res => res.json())
        .then(data => setUser(data.firstname))
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = e => {
    e.preventDefault()
    document.cookie = "uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    setUser("")
    history.push("/")
    setIsLoggedIn(false)
  }
  return (
    <Navbar bg="primary" variant="dark" className="justify-content-between">
      <Nav>
        <Navbar.Brand href="/">Project Explorer</Navbar.Brand>
        <Form inline>
          <Form.Label htmlFor="search-project-nav" srOnly>
          </Form.Label>
          <Form.Control type="text" placeholder="Search Projects" id="search-project-nav" />
          <Button variant="outline-light" type="submit" className="ml-3 mr-2">
            Search
          </Button>
        </Form>
        <Nav>
          <Nav.Link href="/projects">Projects</Nav.Link>
          <Nav.Link href="/projects/submit">Submit</Nav.Link>
        </Nav>
      </Nav>

      {isLoggedIn ? (
        <Nav className="justify-content-end">
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          <Nav.Link>{`Hi ${user}`}</Nav.Link>
        </Nav>
      ) : (
        <Nav className="justify-content-end">
          <Nav.Link href="/signup">Sign up</Nav.Link>
          <Nav.Link href="/Login">Login</Nav.Link>
        </Nav>
      )}
    </Navbar>
  )
}

export default Header