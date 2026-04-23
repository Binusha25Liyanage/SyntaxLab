require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./utils/db');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Exercise = require('./models/Exercise');
const Quiz = require('./models/Quiz');

const htmlLessons = [
  {
    title: 'Introduction to HTML',
    slug: 'introduction-to-html',
    content:
      '# Introduction to HTML\n\nHTML gives structure to web pages. A document usually starts with `<!doctype html>`, then has `<html>`, `<head>`, and `<body>` tags.',
    codeExample: '<!doctype html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello SyntaxLab+</h1>\n  </body>\n</html>',
    language: 'html',
    order: 1,
  },
  {
    title: 'HTML Headings & Paragraphs',
    slug: 'html-headings-and-paragraphs',
    content:
      '# HTML Headings and Paragraphs\n\nUse `<h1>` through `<h6>` for headings and `<p>` for paragraphs. Keep one main `<h1>` per page.',
    codeExample: '<h1>Main Heading</h1>\n<h2>Sub Heading</h2>\n<p>This is a paragraph.</p>',
    language: 'html',
    order: 2,
  },
  {
    title: 'HTML Links & Images',
    slug: 'html-links-and-images',
    content:
      '# HTML Links and Images\n\nUse `<a href="...">` for links and `<img src="..." alt="..." />` for images.',
    codeExample: '<a href="https://example.com">Visit Example</a>\n<img src="https://via.placeholder.com/150" alt="Placeholder" />',
    language: 'html',
    order: 3,
  },
];

const jsLessons = [
  {
    title: 'Variables & Data Types',
    slug: 'variables-and-data-types',
    content:
      '# Variables and Data Types\n\nJavaScript supports `var`, `let`, and `const`. Prefer `const` by default and `let` when values change.',
    codeExample: "const name = 'SyntaxLab';\nlet xp = 0;\nconst isActive = true;",
    language: 'javascript',
    order: 1,
  },
  {
    title: 'Functions',
    slug: 'functions',
    content:
      '# Functions\n\nFunctions can be declared with `function` or arrow syntax `() => {}`.',
    codeExample: "function greet(user) {\n  return `Hello ${user}`;\n}\nconst square = (n) => n * n;",
    language: 'javascript',
    order: 2,
  },
  {
    title: 'DOM Manipulation',
    slug: 'dom-manipulation',
    content:
      '# DOM Manipulation\n\nUse `document.querySelector()` to grab elements and update with `textContent` or `innerHTML`.',
    codeExample: "const root = document.querySelector('#app');\nroot.innerHTML = '<h1>Updated!</h1>';",
    language: 'javascript',
    order: 3,
  },
];

const mkExercise = (lessonId, title, description, starterCode, solutionCode, validationRules) => ({
  lessonId,
  title,
  description,
  starterCode,
  solutionCode,
  validationRules,
  xpReward: 20,
});

(async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      Exercise.deleteMany({}),
      Quiz.deleteMany({}),
    ]);

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);

    await User.insertMany([
      {
        username: 'admin',
        email: 'admin@syntaxlab.com',
        password: adminPassword,
        role: 'admin',
      },
      {
        username: 'demo_user',
        email: 'user@syntaxlab.com',
        password: userPassword,
        role: 'user',
      },
    ]);

    const htmlCourse = await Course.create({
      title: 'HTML Basics',
      slug: 'html-basics',
      description: 'Learn HTML from zero to structure complete pages.',
      language: 'html',
      order: 1,
      isPublished: true,
    });

    const jsCourse = await Course.create({
      title: 'JavaScript Basics',
      slug: 'javascript-basics',
      description: 'Understand JavaScript fundamentals and DOM updates.',
      language: 'javascript',
      order: 2,
      isPublished: true,
    });

    const htmlCreatedLessons = [];
    for (const lesson of htmlLessons) {
      const created = await Lesson.create({ ...lesson, courseId: htmlCourse._id, xpReward: 10 });
      htmlCreatedLessons.push(created);
    }

    const jsCreatedLessons = [];
    for (const lesson of jsLessons) {
      const created = await Lesson.create({ ...lesson, courseId: jsCourse._id, xpReward: 10 });
      jsCreatedLessons.push(created);
    }

    htmlCourse.lessons = htmlCreatedLessons.map((lesson) => lesson._id);
    jsCourse.lessons = jsCreatedLessons.map((lesson) => lesson._id);
    await htmlCourse.save();
    await jsCourse.save();

    const exercises = [
      mkExercise(
        htmlCreatedLessons[0]._id,
        'Create a Basic Page Title',
        'Add an h1 tag that says Welcome.',
        '<h1></h1>',
        '<h1>Welcome</h1>',
        ['has-element:h1', 'contains:Welcome']
      ),
      mkExercise(
        htmlCreatedLessons[1]._id,
        'Add Heading and Paragraph',
        'Add one h2 and one p element.',
        '<h2></h2>\n<p></p>',
        '<h2>About</h2>\n<p>Text</p>',
        ['has-element:h2', 'has-element:p']
      ),
      mkExercise(
        htmlCreatedLessons[2]._id,
        'Link and Image Practice',
        'Create one anchor and one image tag.',
        '<a href="#"></a>\n<img src="" alt="" />',
        '<a href="https://example.com">Link</a>\n<img src="x.png" alt="x" />',
        ['has-element:a', 'has-element:img']
      ),
      mkExercise(
        jsCreatedLessons[0]._id,
        'Declare Variables',
        'Declare a const variable named userName.',
        '// write code',
        "const userName = 'Sam';",
        ['contains:const', 'contains:userName']
      ),
      mkExercise(
        jsCreatedLessons[1]._id,
        'Write a Function',
        'Create a function named add that returns sum.',
        '// write code',
        'function add(a, b) { return a + b; }',
        ['contains:function', 'contains:add']
      ),
      mkExercise(
        jsCreatedLessons[2]._id,
        'Update the DOM',
        'Use querySelector and innerHTML in your code.',
        '// write code',
        "const el = document.querySelector('#app'); el.innerHTML = 'Done';",
        ['contains:querySelector', 'contains:innerHTML']
      ),
    ];

    await Exercise.insertMany(exercises);

    const quizzes = [
      {
        courseId: htmlCourse._id,
        question: 'Which tag defines the main heading of a page?',
        options: ['<p>', '<h1>', '<title>', '<section>'],
        correctIndex: 1,
        explanation: 'The <h1> tag is used for the main heading on a page.',
        order: 1,
        xpReward: 15,
        isPublished: true,
      },
      {
        courseId: jsCourse._id,
        question: 'Which keyword creates a block-scoped variable?',
        options: ['var', 'const', 'let', 'function'],
        correctIndex: 2,
        explanation: 'let creates a block-scoped variable and is mutable.',
        order: 1,
        xpReward: 15,
        isPublished: true,
      },
    ];

    await Quiz.insertMany(quizzes);

    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
})();
