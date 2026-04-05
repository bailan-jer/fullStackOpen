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

export default Course
