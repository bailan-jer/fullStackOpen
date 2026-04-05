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

const Total = ({total}) => <p>Total of exercises {total}</p>

const Course = ({course}) => {
  return (
    <div>
      <Header course = {course.name} />
      <Content parts = {course.parts} />
      <b><Total total = {course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises} /></b>
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
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
      }
    ]
  }

  return <Course course={course} />
}

export default App