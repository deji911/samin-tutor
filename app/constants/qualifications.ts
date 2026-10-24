export type QualificationOption = {
  code: string;
  name: string;
};

export const QUALIFICATIONS_LIST: QualificationOption[] = [
  { code: "SSCE", name: "Senior Secondary School Certificate" },
  { code: "NCE", name: "Nigeria Certificate in Education" },
  { code: "ND", name: "National Diploma" },
  { code: "HND", name: "Higher National Diploma" },
  { code: "OND", name: "Ordinary National Diploma" },
  { code: "B.Sc.", name: "Bachelor of Science" },
  { code: "B.A.", name: "Bachelor of Arts" },
  { code: "B.Ed.", name: "Bachelor of Education" },
  { code: "B.Eng.", name: "Bachelor of Engineering" },
  { code: "LL.B.", name: "Bachelor of Laws" },
  { code: "MBBS", name: "Bachelor of Medicine, Bachelor of Surgery" },
  { code: "B.Tech.", name: "Bachelor of Technology" },
  { code: "B.Pharm.", name: "Bachelor of Pharmacy" },
  { code: "PGD", name: "Postgraduate Diploma" },
  { code: "PGDE", name: "Postgraduate Diploma in Education" },
  { code: "M.Sc.", name: "Master of Science" },
  { code: "M.A.", name: "Master of Arts" },
  { code: "M.Ed.", name: "Master of Education" },
  { code: "MBA", name: "Master of Business Administration" },
  { code: "LL.M.", name: "Master of Laws" },
  { code: "M.Eng.", name: "Master of Engineering" },
  { code: "Ph.D.", name: "Doctor of Philosophy" },
  { code: "Ed.D.", name: "Doctor of Education" },
  { code: "Other", name: "Any qualification not listed" },
];
