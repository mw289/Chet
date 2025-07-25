#  &nbsp;Inspiration

Education should be a space where every student thrives, not just those who fit the traditional mold. Yet, many educational institutions still design their resources and environments around reading/writing learning styles, unintentionally sidelining visual and kinesthetic learners. We believe that the playing field should be equal, in support of UN SDG 4&10, for all members of society, and that’s where ViSim comes in.

#  &nbsp;What it does

ViSim aims to reshape the world of education, empowering both visual and kinesthetic learners that have been ostracized from the traditional reading/writing learners. With the usage of gpt-4o API, ViSim serves as an automatic physics experiment simulation generator. Students can simply type in a short sentence regarding a concept or experiment and…BAAM! Within a few moments, ViSim will generate a fully dynamic and interactive simulation using agents. This simulation engages the learner with both sliders and/or toggles with a visual display that changes results in response to the variables. The user can then save this generated simulation locally on his/her computer, or save it to the library feature in ViSim which allows them to revisit their generated simulations, anytime they need it.

#  &nbsp;How we built it
We used v0.dev to AI generate some code

##  &nbsp;Frontend
Our Frontend was designed with simplicity in mind, for users to immediately start learning once they boot it up.

###  &nbsp;Framework:
Next.js

###  &nbsp;Language:
TypeScript

###  &nbsp;UI/Styling:
Radix UI Tailwind CSS

###  &nbsp;Build Tools:
PostCSS Tailwind Autoprefixer

##  &nbsp;Backend
Our backend was built with a modular agent pipeline, coordinated by an orchestrator, as its base.

###  &nbsp;Agents
Orchestrator (Generates complete, accurate HTML physics simulations based on user input, focusing on structure, style and interactivity)

Code Generator Agent (A JavaScript simulation expert specializing in p5.js and matter.js. This agent generates clean, beginner-friendly simulation code based on a prompt, UI controls, and educational explanations. It is required to integrate all controls and explanations, use proper structure, and output only runnable JavaScript code.)

UI Generator Agent (Generates p5.js UI controls for physics simulations. Given key variables, simulation goals, and user level, it creates a schema of UI controls (sliders, buttons, checkboxes), setup code, and draw code. The agent ensures controls are appropriate for the user’s level and simulation context.)

Explainer Agent (An educational physics simulation expert that analyzes p5.js code and generates overlays, tooltips, and annotations to explain key physics concepts, interactive elements, and real-time values.)

Interpreter Agent (A code validator for educational JavaScript simulations. It checks, fixes, and validates p5.js code, ensuring proper structure, safety, and interactivity. It outputs either corrected code or a clear error message, focusing on making the code runnable and safe.)

Sandbox Optimizer Agent (Optimizes simulation code for real-time preview in a web sandbox. It ensures the code is performant, visually clear, interactive, and robust against errors. The agent adds educational enhancements, keyboard shortcuts, and real-time value displays, outputting optimized code and an HTML wrapper.)

###  &nbspAuthentication & Database:
Supabase (@supabase/supabase-js, @supabase/ssr) Supabase Auth (user management, RLS, etc.)

###  &nbspAI Integration:
OpenAI (gpt-4o) via @ai-sdk/openai and ai

#  &nbsp;Challenges we ran into

As first-time participants, our lack of experience really showed in certain times, but the adventure was extremely thrilling. The following are some of our challenges as a team:

##  Brainstorming

When we first received the tracks, we found it challenging to not only think of relevant, inspiring ideas, but also to decide on which track to follow. As a result, we spent a crucial 3 hours researching data and statistics, brainstorming possible ideas. Although it was mentally draining, we kept on pushing, and finally…we came up with ViSim.

## Scheduling Conflicts

One of our team members had an urgent situation, resulting in her physical absence for the first 2 days. We had to figure out a way for her to work remotely while we work in person. We ended up splitting the app into smaller tasks for us to all work on then integrate into the main website. We also held meetings every night in order to help each other with issues and figure out problems.

## Technical Roadblocks

Many of us experienced various dependency errors. Despite downloading all of the dependencies needed, we still could not run the code. This was extremely mentally frustrating especially during the crux of time. Additionally, the agents’ output was honestly not up to our expectations, which required a lot of effort in order to successfully deploy our idea. Nonetheless, we persevered and managed, modifying our code to accommodate these issues, or even just simply fixing these persistent issues.

#  &nbsp;Accomplishments that we're proud of

We're proud that we managed to challenge ourselves technically by creating this modular agent pipeline with an orchestrator, incorporating AI into it, and even fine tuning it. We believe that our success is a display of our growth over the past 30 hours.

#  &nbsp;What we learned

Throughout the development of ViSim, we stumbled upon multiple lessons that will prove to be essential in the coming future. On the technical side of things, we learnt how to orchestrate the pipeline powered by multiple agents, which proved to be a technical challenge, delving into integrating the gpt-4o API. This whole project showcases the incredible limits of AI that we may never reach. Speaking non-technically, we experienced the importance of adaptability and responsiveness first hand, each taking up our own responsibilities and helping wherever we can. Additionally, the importance of time management became clear to us, especially with our lack of experience. This really highlighted how essential communication and chemistry between team members is in a time-pressured environment.

#  &nbsp;What's next for ViSim

With its strong foundation, ViSim is set to evolve further—bringing even more innovative features to empower students here in Indonesia. We plan to not only integrate a stronger API model to enhance code generation, but we also plan to plunge into even more complex concepts that even standard books have trouble explaining. In addition, we plan to also incorporate more subjects that require strong visualization such as Chemistry, Math and Biology. This way, Indonesian students can freely visualize any subject and any topic, anytime they want. Furthermore, we also plan to integrate ViSim into different schools and foundations here in Indonesia, allowing teachers to also implement ViSim into their classrooms, skyrocketing student engagement and lesson retention. By further optimizing ViSim, we are able to skyrocket user engagement and satisfaction, allowing all learners in Indonesia to visualize educational concepts without difficulty.

# ⚙️ &nbsp;How to Run
1. Clone this repository from terminal using this following command
   ```bash
   $ git clone https://github.com/mw289/Chet.git
   ```
2. Install all the required dependencies using this following command in the project root directory
   ```bash
   $ npm install
   ```
3. Run the website using this following command
   ```bash
   $ npm run dev
   ```




   Note: We used v0 to generate some code for us

