/* This code snippet is exporting an object named `schemaOptions` in TypeScript. This object contains
various options for defining the schema behavior in a TypeScript application. Here is a breakdown of
what each key in the `schemaOptions` object represents: */
export const schemaOptions = {
  timestamps: true,
  id: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
    versionKey: false,
  },
  toObject: {
    virtuals: true,
  },
};
