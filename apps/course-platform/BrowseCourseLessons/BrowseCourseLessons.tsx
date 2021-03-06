import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from 'course-platform/utils/api'
import { useCoursesContext } from 'course-platform/CoursesContext'
import { Heading } from 'course-platform/Heading'
import { DataGrid, Row, Col } from 'course-platform/DataGrid'
import { AppSidebar } from 'course-platform/AppSidebar'
import { RecentLessons } from 'course-platform/RecentLessons'
import { CreateLessonDialog } from 'course-platform/CreateLessonDialog'
import { LessonPreviewDialog } from 'course-platform/LessonPreviewDialog'
import { Loading } from 'course-platform/Loading'
import { NoResults } from 'course-platform/NoResults'
import { PreviousNextCourse } from 'course-platform/PreviousNextCourse'
import type { Lesson } from 'course-platform/utils/types'

export function BrowseCourseLessons() {
  const courseSlug = useParams().courseSlug!

  // General State
  const [createLessonDialog, setCreateLessonDialog] = useState(false)
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null)

  // Data
  const { getCourse, isLoading, fetchCourses } = useCoursesContext()
  const course = getCourse(courseSlug)
  const lessons = course?.lessons

  if (!isLoading && !course) {
    return <div className="card">Not Found</div>
  }

  function removeLesson(lessonId: number) {
    api.courses.removeLesson(lessonId).then(() => {
      fetchCourses()
    })
  }

  return (
    <>
      <div className="flex flex-gap">
        <div className="spacing flex-1">
          <div className="card flex-split">
            <Heading>
              Course: <span className="text-blue">{course?.name}</span>
            </Heading>
            <nav>
              <PreviousNextCourse courseId={course?.id} />
            </nav>
          </div>
          <div className="card spacing">
            <Heading size={2}>Lessons</Heading>

            {isLoading && !lessons && <Loading />}
            {!isLoading && Array.isArray(lessons) && lessons.length === 0 ? (
              <NoResults>
                <div className="spacing">
                  <p>No Lessons for this Course</p>
                  <button className="button" onClick={() => setCreateLessonDialog(true)}>
                    Create Lessons
                  </button>
                </div>
              </NoResults>
            ) : (
              <>
                <DataGrid>
                  {lessons?.map((lesson) => {
                    return (
                      <Row key={lesson.id}>
                        <Col flex>
                          <Link to={lesson.slug} className="block text-large">
                            <b>{lesson.name}</b>
                          </Link>
                          <div>
                            {course?.slug}/{lesson.slug}
                          </div>
                        </Col>
                        <Col>
                          <div className="horizontal-spacing">
                            <button
                              className="button button-small button-outline"
                              onClick={() => removeLesson(lesson.id)}
                            >
                              Remove
                            </button>
                            <button
                              className="button button-small button-outline"
                              onClick={() => setPreviewLesson(lesson)}
                              disabled={!lesson.content}
                            >
                              Preview
                            </button>
                          </div>
                        </Col>
                      </Row>
                    )
                  })}
                </DataGrid>
                <footer>
                  <button className="button" onClick={() => setCreateLessonDialog(true)}>
                    Create Lessons
                  </button>
                </footer>
              </>
            )}
          </div>
        </div>
        <AppSidebar>
          <RecentLessons />
        </AppSidebar>
      </div>
      {createLessonDialog && course && (
        <CreateLessonDialog
          course={course}
          onClose={() => setCreateLessonDialog(false)}
          onCreate={fetchCourses}
        />
      )}
      {previewLesson && (
        <LessonPreviewDialog
          lesson={previewLesson}
          onClose={() => {
            setPreviewLesson(null)
          }}
        />
      )}
    </>
  )
}
