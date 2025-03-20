import dayjs from "dayjs"
import * as yup from "yup"

export const createUpdateEventSchema = yup
.object({
  title: yup.string().required(),
  description: yup.string().required(),
  dueDate: yup.mixed().test((value) => {
    return dayjs(value as dayjs.Dayjs).isAfter(dayjs()) || false;
  }).required(),
  priority: yup.string().oneOf(['IMPORTANT', 'NORMAL', 'CRITICAL']).required(),
})
.required()