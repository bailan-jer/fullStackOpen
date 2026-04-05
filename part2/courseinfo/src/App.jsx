const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map(part => <Part key = {part.id} name = {part.name} exercises = {part.exercises} />)}
  </div>
)

const Part = ({name, exercises}) => (
  <p>
    {name} {exercises}
  </p>
)

const Total = ({parts}) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0)
  return <p>Total of exercises {total}</p>
}

const Course = ({course}) => {
  return (
    <div>
      <Header course = {course.name} />
      <Content parts = {course.parts} />
      <b><Total parts = {course.parts} /></b>
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  const courseMap = (course) => {
    return <Course key = {course.id} course = {course} />
  } 

  return (
    <div>
      {courses.map(courseMap)}
    </div>
  )
}

export default App