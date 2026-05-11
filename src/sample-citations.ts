import type {
  AwardName,
  SampleNomination,
  SampleCitationsResponse,
} from "./types.js";

export const SAMPLE_NOMINATIONS: SampleNomination[] = [
  // --- Chief Scout's Commendation for Good Service ---
  {
    nomineeName: "Jay Smith",
    awardLevel: "Chief Scout's Commendation for Good Service",
    mainRole:
      "Jay has been a dedicated and valued Team Member of the Cub Section Team for the past six years. They are well respected by the Cubs and they are a great asset to the team. Their commitment, enthusiasm, and reliability are key to helping run the weekly meetings, where they consistently support the Team Leader with programme planning and ensure engaging and well-organized activities for the young people.",
    additionalService:
      "Beyond their contributions at the Group level, Jay plays a crucial role within the District as its go-to 'tech guru.' Using their IT expertise, they have been instrumental in streamlining the introduction and management of District email addresses. They not only manage the e-mail accounts but also run training sessions to support leaders who may be less confident with technology. Jay's patience and willingness to assist others has had a significant positive impact across the District.",
    keyAchievements:
      "In addition to their weekly contributions, Jay has taken the lead in organising and running Cub camps, having successfully gained their Nights Away Permit. Over the past two years, their leadership in these camps have provided Cubs with some great experiences, enabling them to earn their Nights Away badges and gain confidence outdoors.",
    levelOfService:
      "Jay has demonstrated outstanding commitment in their role and is an asset to the Cub Team.",
    communityInvolvement:
      "Jay volunteers two hours a week at the local food bank and even arranged for the Cubs to visit last term.",
    otherInformation:
      "N/A",
    citation:
      "Jay is a dedicated and valued member of the Cub Team. They help to run an exciting programme, night's away and are well respected by the Cubs. Their support with the District e-mail system has had a significant impact and Jay brings enthusiasm and great ideas to the team. For their contribution to local scouting, Jay is awarded the Chief Scout Commendation for Good Service.",
  },
  {
    nomineeName: "Ruby Leader",
    awardLevel: "Chief Scout's Commendation for Good Service",
    mainRole:
      "Ruby first joined the Beaver section as a Young Leader while completing the volunteering section of her Gold Duke of Edinburgh's Award. Her passion for Scouting was evident from the start, and she chose to continue her involvement beyond her initial commitment. Upon turning 18, she became a dedicated Team Member in the Section Team (Beaver), making a lasting impact on the young people in her care.",
    additionalService:
      "Beyond her contributions at the Group level, Ruby also plays a vital role in the County Volunteering Development Team, supporting and mentoring new Team Members.",
    keyAchievements:
      "Two years ago, Ruby stepped up as Team Leader when her predecessor retired. Since then, she has completed all her training and now leads one of the largest lodges in the District. Under her leadership, the lodge has seen remarkable growth, doubling in size from 15 to 30 Beavers in the past year alone. She delivers an engaging and enriching programme alongside her team, ensuring every child has the opportunity to develop and thrive within Scouting.",
    levelOfService:
      "At just 23 years old, Ruby balances her dedication to the Scouts alongside studying for a medical degree. I honestly don't know how she fits it all in!",
    communityInvolvement:
      "Ruby volunteers several days a month at the local hospice.",
    otherInformation:
      "N/A",
    citation:
      "Ruby is a credit to the movement. Under her leadership, the group has seen growth in numbers and a high-quality Beaver programme. In recognition of her outstanding service, I strongly recommend that she be awarded the Chief Scout's Commendation for Good Service.",
  },
  // --- Award for Merit ---
  {
    nomineeName: "Anne Tent",
    awardLevel: "Award for Merit",
    mainRole:
      "Anne has served as a Cub Scout Leader in Reigate for many years, taking primary responsibility for the planning, organisation and delivery of a high-quality Cub programme. This role involves weekly meetings, activity planning, administration, communication with parents, and ensuring safe and engaging experiences for young people. For extended periods, Anne has effectively run the Pack as the only consistent leader, relying on short-term parental support to maintain operations. Despite this, she has demonstrated exceptional commitment, dedicating significant personal time each week to sustain the Pack and its activities.",
    additionalService:
      "In addition to leading the Cub Pack, Anne has actively supported wider Scout Group, District and County activities. She has regularly contributed to District Camps, St George's Day events, Church Parades, and other shared Scouting activities. Her involvement ensures that Cubs are fully integrated into the wider Scouting community, and she consistently commits additional time beyond her core role to support these events and opportunities.",
    keyAchievements:
      "Anne's most significant achievement has been maintaining a strong and sustainable Cub Pack in Reigate through challenging periods, often with minimal leadership support. She has consistently maintained a Pack of around 25 Cubs, demonstrating stability and sustained engagement. Each year, approximately 8 Cubs achieve their Chief Scout's Silver Award, reflecting the high quality, consistency and effectiveness of the programme she delivers. For several years, her Pack was the only Cub provision in Reigate, playing a critical role in supporting the local Scouting structure. She ensured continuity in the Scouting pathway by successfully feeding Cubs into a Scout Troop in another Group, maintaining a positive and effective inter-Group relationship. Anne played a key role in the 2008 merger that formed the 1st Reigate Scout Group, offering wholehearted support and practical assistance that contributed significantly to its success. Without Anne's sustained effort, it is highly likely that Cub Scouting in Reigate would not have continued, impacting both Beaver progression and Scout Troop recruitment.",
    levelOfService:
      "Anne has consistently delivered service at an exceptional level over many years. Her ability to maintain, and at times grow, the Cub Pack despite limited resources demonstrates not only consistency but also a sustained high level of commitment and resilience. Her service has not only remained at a high standard but has increased in complexity, particularly during periods where she operated with minimal team support and during the Group merger. Her leadership during these times highlights a significant contribution beyond normal expectations.",
    communityInvolvement:
      "Anne has actively supported community-facing Scouting activities, including participation in parades, community events, and joint Scouting functions. Her work has strengthened the visibility and reputation of Scouts within the local community, and her efforts have directly contributed to maintaining engagement and participation across the Movement in Reigate.",
    otherInformation:
      "Anne's dedication, resilience, and ability to deliver a consistently high-quality programme under challenging circumstances are exceptional. Her leadership has ensured continuity of Cub Scouting in Reigate over many years, benefiting countless young people and supporting the wider Scouting structure. Her commitment, often with limited support, is a testament to her capability and unwavering dedication to Scouting.",
    citation:
      "Anne has given outstanding and sustained service to Cub Scouting in Reigate over many years. Through her dedication, resilience and leadership—often working with minimal support—she has maintained a thriving Cub Pack of around 25 young people, with approximately 8 Cubs each year achieving the Chief Scout's Silver Award. She has supported the wider Scouting community and played a vital role in the development of the 1st Reigate Scout Group. Her contribution has ensured continuity and growth within local Scouting, benefiting generations of young people. She is thoroughly deserving of recognition through a Good Service Award.",
  },
  {
    nomineeName: "Rita Camp",
    awardLevel: "Award for Merit",
    mainRole:
      "Rita Camp has been a dedicated volunteer with 3rd Aberffynnon Scout Group for 15 years, primarily serving within the Beaver Scout Section. Her role involves planning and delivering an engaging weekly programme, supporting young people's development, and managing the administration and coordination required to run a successful Section. She demonstrates a significant time commitment, not only through regular meetings but also through preparation, communication with parents, and leadership of additional activities such as camps and events.",
    additionalService:
      "Beyond leading within the Beaver Section, Rita plays an active role at District level. She holds the Area Nights Away Assessor accreditation and contributes to the District Programme Team, supporting compliance and best practice in Nights Away activities. She has assisted leaders across the District in gaining their Nights Away Permits and has actively encouraged the use of the Passport Scheme within the Explorer Scout Section, enabling more opportunities for youth-led camps and expeditions. Rita also supports Young Leaders from the District Explorer Scout Unit, mentoring them as they complete their Young Leader Award.",
    keyAchievements:
      "Rita has played a central role in the growth and success of the Beaver Section at 3rd Aberffynnon. She has helped grow the Section to 38 Beavers, now operating across two colonies on different nights to meet demand. Over the past three years, 100% of Beavers moving on to Cubs have achieved their Chief Scout's Bronze Award, demonstrating the consistently high quality of the programme. She has maintained a high retention rate from Beavers to Cubs, ensuring strong progression within the Group. Rita has successfully developed adult volunteers, supporting four occasional parental helpers to become fully-fledged Team Leaders who have remained in Scouting beyond their children's involvement. She has organised several District Beaver camps, giving young people valuable outdoor experiences, often their first time away from home.",
    levelOfService:
      "Since receiving her Chief Scout's Commendation for Good Service in 2006, Rita has continued to provide service at an exceptionally high level, with clear growth in both impact and responsibility. Her role has expanded beyond her Group to influence District-wide Scouting, particularly through her work as a Nights Away Assessor and mentor to other leaders. The scale, complexity and impact of her service have significantly increased, reflecting a sustained and enhanced contribution.",
    communityInvolvement:
      "Rita's work through Scouting has had a strong community impact, particularly in enabling young people to access outdoor experiences and develop independence. Her organisation of District Beaver camps brings together young people from across the area, strengthening community connections within Scouting. Additionally, her support for developing adult volunteers ensures long-term sustainability and growth within the local Scouting community.",
    otherInformation:
      "Rita is a passionate advocate for what she describes as 'a Beaver's right to camp,' and her commitment to this principle has ensured that many young people experience their first nights away in a safe, supportive and enjoyable environment. Her ability to inspire both young people and adult volunteers, combined with her dedication to maintaining high standards, makes her an invaluable asset to her Group and District.",
    citation:
      "Rita Camp has given outstanding and sustained service to Scouting over 15 years with 3rd Aberffynnon Scout Group. Since receiving her Chief Scout's Commendation for Good Service in 2006, she has significantly expanded her impact, growing the Beaver Section to 38 young people across two colonies and achieving a 100% Chief Scout's Bronze Award success rate for those moving to Cubs in recent years. Through her leadership, development of adult volunteers, and District-wide contributions as a Nights Away Assessor, she has enabled high-quality Scouting experiences for both young people and leaders. Her dedication, enthusiasm and commitment make her truly deserving of further recognition through a Good Service Award.",
  },
  // --- Bar to the Award for Merit ---
  {
    nomineeName: "Joe Hike",
    awardLevel: "Bar to the Award for Merit",
    mainRole:
      "Joe Hike has recently been appointed as Chair of the District Trustee Board, a key leadership role responsible for governance, strategic direction, and ensuring the effective operation of the District. This includes oversight of finance, property, compliance, and supporting the delivery of high-quality Scouting across all Sections. Joe brings exceptional organisational and professional skills to the role, dedicating significant time to planning, coordination, and communication. He has established a structured and forward-thinking approach, ensuring Trustee Board meetings are regular, purposeful and outcome-driven.",
    additionalService:
      "In addition to his governance responsibilities, Joe is actively involved in strengthening the District's operational capacity. He has successfully recruited professional trustees to enhance the skills and effectiveness of the Trustee Board, ensuring stronger governance and long-term sustainability. Joe is also heavily involved in programme development, working with the District team to reintroduce and create engaging activities aligned with the Scouts 'Skills for Life' strategy.",
    keyAchievements:
      "Joe has already made a substantial and measurable impact within a short period of time. He has overseen and supported investment planning totalling approximately £150,000, strengthening the District's financial and asset base. He has secured £75,000 in funding to significantly improve the District Headquarters, including the installation of gender-neutral toilets, a new kitchen, solar panels, and improved insulation — modernising the facility and making it more inclusive, sustainable and fit for purpose. He has strengthened governance by recruiting skilled, professional trustees, increasing the Board's capability and resilience. He has reinvigorated District activity planning, reintroducing popular events such as the swimming gala and cross-section sports. He has introduced new initiatives aligned with 'Skills for Life,' including practical skill-based activities and intergenerational events. The newly introduced District 'Interactive Quiz' has already proven highly popular, increasing engagement across Sections.",
    levelOfService:
      "Although recently appointed, Joe is already delivering service at a level significantly above expectations. The scale and complexity of his contribution — spanning governance, finance, property development, and programme support — demonstrate a substantial increase in impact compared to a typical Chair role. His leadership has not only maintained but notably enhanced the effectiveness, ambition and capability of the District.",
    communityInvolvement:
      "Joe is also heavily involved in the local community through his work with the Rotary Club, where he contributes to charitable initiatives and community events. In particular, he supports the local Rotary sleigh, helping to raise funds and bring festive engagement to the community. This involvement complements his work in Scouting, strengthening community connections and raising the profile of volunteering more broadly.",
    otherInformation:
      "Joe is highly responsive, dependable and proactive. Nothing is ever too much trouble, and he consistently delivers tasks quickly and to a high standard. His ability to combine strategic thinking with practical delivery makes him particularly effective. He communicates regularly and clearly with the team, ensuring alignment, engagement and momentum across all areas of District activity.",
    citation:
      "Joe Hike has made an exceptional impact as Chair of the District Trustee Board in a short period of time. Through his leadership, he has strengthened governance by recruiting professional trustees, overseen investment planning of approximately £150,000, and secured £75,000 in funding to modernise the District Headquarters with inclusive and sustainable improvements. Alongside this, he has revitalised District activities and introduced innovative programmes aligned to 'Skills for Life.' His commitment extends into the wider community through his work with the Rotary Club, further demonstrating his dedication to service. His energy, vision and leadership have significantly enhanced the strength and direction of the District, making him highly deserving of recognition.",
  },
  {
    nomineeName: "Richard Pack",
    awardLevel: "Bar to the Award for Merit",
    mainRole:
      "Richard has continually provided outstanding service, firstly as a Cub Section Team Member and more recently as a Group Lead Volunteer. Richard remains an active participant in the Scout Troop and the partnered Explorer Scout Unit. He takes part in the twice-yearly walking weekends organised by the Group, and is a regular visitor to section camps and activities. He is a source of support to the Leadership Team, whether by contributing programme ideas, leading section meetings, or helping with nights away activities.",
    additionalService:
      "Richard has recently undertaken specific learning for his new role within the Volunteering Development Team in order to maintain and progress the development of leaders within the Group. He has also recruited others to the Group Leadership Team and delegated some of the responsibilities of the successful running of the Group to them. This has enabled the Group to grow further with the recruitment of more than 40 Non Members from parents of young people within the Group. This has enabled Richard to maintain focus on essential tasks, developing and supporting his team, leading section meetings where necessary, and contributing to programmes across all of the sections.",
    keyAchievements:
      "Richard is increasingly working as mentor to new Team Leaders in the Group. He has recruited other Team Members, who he is supporting to take on a number of aspects of this role. He also works with the other Team Leaders in sharing practical skills. Richard always looks for ways to engage with the Group's local community. He ensures that they always have a high number who attend the District's St George's Day Parade and Church Parades.",
    levelOfService:
      "Since he received the Medal of Merit 16 years ago, he has taken on the role of Lead Volunteer for the Group Leadership Team. He consistently supports his thriving Group, comprising 120 youth members in 2 Beaver Colonies, 2 Cub Packs and a Scout Troop, not to mention the Explorer Scout Unit with which the Group has a seamless active partnership. Richard is an active contributor to Group Leadership Team meetings in the District, and has provided advice and support to new Group Lead Volunteers too.",
    communityInvolvement:
      "Within the wider community, Richard promotes an active partnership with the Scout Group's sponsoring authority in the local Church and is their representative on the Church Council. He recently led the Group in delivering an inspirational service to the congregation and the Group plan to make this an annual contribution.",
    otherInformation:
      "Richard has given further outstanding service to the Scouts and within the local community; his dedication and contributions are inspirational and we feel he should be considered for a Good Service Award.",
    citation:
      "Richard has given further outstanding service as Group Lead Volunteer, growing the Group to 120 youth members across multiple sections and mentoring new leaders. His community partnerships and dedication to developing others make him deserving of recognition.",
  },
  // --- Silver Acorn ---
  {
    nomineeName: "Charlie Fire",
    awardLevel: "Silver Acorn",
    mainRole:
      "Charlie's commitment to the Scouts within this District continues to be highly consistent and they have given service of a very high standard. Charlie initially became involved as Group Treasurer, overseeing the financial arrangements of this large and complex Group. Their background in accounting quickly proved to be invaluable, and their advice and guidance has been second to none. Charlie's first sectional role was as Scout Section Team Leader. They provided highly interesting and exciting programmes, culminating in numerous young people achieving the top awards. They organised creative and adventurous weekly programmes, along with camps, hikes, trips and expeditions. After ten years as Scout Section Team Leader they then stepped up to become the Lead Volunteer of 3rd Anytown, a Group with ten sections and its own headquarters. Charlie established an effective Trustee Board and a Fundraising Team that now ensures the Group headquarters has sufficient funds to allow the management committee (also formed by Charlie) to keep the premises a warm, safe, secure and welcoming place for all its members. The new £100,000 extension with toilets, kitchen and changing area would not have been possible without Charlie's drive and energy. Although it is not possible to measure the impact they have had on countless young people over the fifteen years they have been the Lead Volunteer of 3rd Anytown, the large number of youth members involved during this time speaks for itself.",
    additionalService:
      "In addition, Charlie spent a long time supporting the District Treasurer. Their calm and methodical approach was much valued by the whole District Trustee Board, especially during the difficult process of selling the old headquarters of 1st Anytown due to the need for extensive renovation and modernisation.",
    keyAchievements:
      "Charlie continues to be the prime motivator within their Scout Group, a Group that has nearly two hundred members and ten sections, making it larger than some Districts. They play a major role in recruitment, induction and support of their leaders and regularly visits all the sections. As the Lead Volunteer of 3rd Anytown they are regularly seen at the Group's sectional meetings and is known to all the young people. The Group continues to be highly successful, and plays an active part in all the events organised by the District. Since Charlie became the Lead Volunteer, 3rd Anytown has grown from strength to strength, raised over £200,000 to improve and extend the headquarters and raised separate funds to ensure two Explorer Scouts from this Group could attend the last World Jamboree.",
    levelOfService:
      "Charlie does not hold any other award for Good Service. Their service has been of a consistently high standard across multiple roles over many years, progressing from Group Treasurer to Scout Section Team Leader to Lead Volunteer of one of the largest Groups in the District.",
    communityInvolvement:
      "School governor at Anytown Primary School for 10 years.",
    otherInformation:
      "Charlie has given service of a high standard and in recognition of his especially distinguished service, I would like to nominate them for the Silver Acorn.",
    citation:
      "For especially distinguished service as Lead Volunteer of 3rd Anytown, growing the Group to nearly 200 members across ten sections, raising over £200,000 for headquarters improvements, and providing outstanding leadership over many years.",
  },
  {
    nomineeName: "Rob Badge",
    awardLevel: "Silver Acorn",
    mainRole:
      "Rob currently holds two roles, working as part of the District Volunteering Development Team on learning and the Group Programme Team as a Skills Instructor. He is invaluable in both of these roles, bringing his experience as both a leader and a Scout to the fore. He uses his leadership skills to train others to become the leaders of the future and he uses his Scouting skills to enthuse and develop young people. He continues to support others through his District Learning Assessor role, and in this role was attending four different sectional meetings a week. In some Groups there were no appointed leaders and in order to give full learning support to new volunteers in Beavers, Cubs and Scouts in different Groups, some on the same evenings, Rob would travel to enable young people the opportunity to enjoy Scouts and give valuable learning support to the new adult volunteers.",
    additionalService:
      "Rob received a Bar to the Award for Merit 10 years ago (and it is 19 years since he received the Award for Merit), but his dedicated service has continued. He has undertaken many and various roles since that time: District Programme Team Leader (for Cubs), District Lead Volunteer, Cubs Section Team Leader, Scouts Section Team Leader, and is currently part of the Group Programme Team as a Skills Instructor and the District Volunteering Development Team assisting with learning. Rob approached them all with dedication and gusto. He promoted the growth of Scouts in the city as District Lead Volunteer, introduced Activity days to accompany a Promise renewal event, creating renewed interest and excitement for all. The 10th Hilltown Group owns a minibus, which Rob takes bookings, re-fuels, and arranges MOTs and any minor repairs for. The District campsite required a much-needed facelift, in order to attract any campers. Rob was and still is on the management committee, seeking funds to undertake ground works and modernisation, but also very much hands on, carpentry and decorating skills very much coming to the fore. He mows the grass at one headquarters and he is a Non Member at another group, noting his retained learning support and campsite roles.",
    keyAchievements:
      "During Rob's tenure as District Lead Volunteer the district headquarters became a significant project which lasted a little over 3 years. The building was in the centre of the city, ancient, crumbling and no longer fit for purpose. With Rob's diligence, guidance and a lot of work from the Trustee Board, the building has been transformed. The top floors were re-built and re-furbished, now providing residential lettings and income for the district, whilst the two lower floors have been re-designed, damp eradicated and modernised to provide two fantastic meeting halls providing weekly urban Scouting. Rob spearheaded fundraising efforts both in the District and in the wider community, raising over £250,000 in cash, and unfathomable hours of in-kind help and work from businesses and members of the community who donated materials, wisdom and joined in the effort. Always keen to promote fun and adventure for young people, Rob instigated District away days, one to Legoland and one seeing the whole district take a steam train to the seaside.",
    levelOfService:
      "Since his last good service award, Rob has continued to offer service of a most exceptional nature. He offers sterling and dutiful work wherever he commits and is known in the local community as 'Mr Scouting'. I have no hesitation in recommending him for the award of a Silver Acorn.",
    communityInvolvement:
      "Every Wednesday afternoon Rob volunteers at our local Hospice Charity shop.",
    otherInformation:
      "Rob's wife passed away three years ago. Despite this, his commitment to the Scouts had never wavered.",
    citation:
      "For especially distinguished service across multiple roles including District Lead Volunteer, raising over £250,000 to transform the district headquarters, and providing unwavering dedication to developing leaders and young people.",
  },
  {
    nomineeName: "Yasmin Necker",
    awardLevel: "Silver Acorn",
    mainRole:
      "Yasmin is the Scout Section Team Leader and the essential ingredient in the Toytown Scout Troop. With support from her Section Team Members, she takes the lead on programme planning, preparing the resources for the evening meetings and organising regular and frequent camps. These include water activity camps in Cumbria, joint camps with their Cubs and the Noddy Group and exchange camps with the Stavanger Scouts in Norway. They also attend the Haarlem Jamborette in the Holland region of The Netherlands every four years. A very active troop. Yasmin attends all appropriate District and Group meetings and represents the Group at others. Her troop takes part in all District activities — often with great success and she is now planning on the troop participating in County events. She is utterly reliable in her position as Scout Section Team Leader — and it is due to this dependability that the troop has developed so well. Yasmin easily devotes over five hours a week to her Scout troop.",
    additionalService:
      "As well as her main role as the Scout Section Team Leader, Yasmin also has a permit as an instructor for the District climbing wall and is Quartermaster for both the local Guides and her own Scout Group. In these capacities, she devotes at least two days a month at weekends. She is also a member of the District Programme Team where she plays a full part. She organises the District New Year's Day walk each year (about 75 attend) and takes part in all their work supporting the District activities. Yasmin is also currently undertaking a role on the District Lead Volunteer search group where she is adding great value — championing how the next District Lead Volunteer needs a team that really supports the sections in increasing programme quality.",
    keyAchievements:
      "Yasmin took over as Scout Section Team Leader when the troop was down to just six youngsters, six years ago, and it has now grown to a constant 30 members. This is solely down to her drive and her efforts to provide quality Scouting in the area. Yasmin encouraged Scouts to bring friends along on 'Bring a Buddy' nights which saw Troop numbers rise steadily, and also took time to visit the local schools to promote Scouting. Each year Yasmin's Scouts achieve around 10 Chief Scout's Awards, attend at least four camps and take part in several additional activities such as climbing, canoeing and overnight hikes. Last year her troop won the District camping trophy, beating 12 other teams. Last year she ran 10 climbing sessions on the District wall — well over 100 young people benefitted.",
    levelOfService:
      "Since Yasmin was awarded the Bar to the Award for Merit (eight years ago) she has become far more active at a District level. Her efforts are benefitting far more people than just her own Troop and covers a far greater variety of activity than at the time of her last award.",
    communityInvolvement:
      "Yasmin is also the Quartermaster for the local Guides where her partner is involved. They confirm that she does a tremendous job in that role.",
    otherInformation:
      "Yasmin is a good team player — offering ideas and insights but able to accept other views. She is a hard worker and is able to retain the respect of all members of the Guides and Scouts in spite of some historical factionalism. This is particularly impressive as she has had to grapple with a socialising problem all her life due to being on the autistic spectrum (and only diagnosed as an adult), however she tries not to let this hold her back in all of her endeavours. Yasmin relates well to the youngsters which is self-evident from the successful growth of her troop.",
    citation:
      "For especially distinguished service growing the Toytown Scout Troop from 6 to 30 members, delivering outstanding programmes including international exchanges, and contributing significantly to District activities as climbing instructor and Programme Team member.",
  },
  // --- Bar to the Silver Acorn ---
  {
    nomineeName: "Jill Tree",
    awardLevel: "Bar to the Silver Acorn",
    mainRole:
      "Jill is part of the District Trustee Board and provides an effective support to the District Lead Volunteer in every aspect of managing the District and Groups with administration. Both the District Lead Volunteer and District Trustee Board Chair speak very highly of her thoroughness and attention to detail. Her work is also greatly appreciated by the Group Lead Volunteer's and Group Trustee Board's.",
    additionalService:
      "Jill provides support with finances and planning for the District Gang Show, which is always a highlight of the calendar and brings several groups together.",
    keyAchievements:
      "Her financial skills have helped build the assets and finances of the County to enable further growth and development with sound footings. Jill also organises and runs the yearly raffle and games evening for 2nd Ashfield, which regularly raises over £800 for their equipment and activities, as well as giving leaders and parents a chance to socialise.",
    levelOfService:
      "Jill has provided loyal and distinguished service to the Scouts for over 28 years and since being awarded the Silver Acorn 16 years ago, she has single-handedly reformed and modernised the accounting, reporting and management systems within the County. Jill has ensured this has happened by budget setting, reporting and careful management of all accounting function. Whilst this has been a challenging strategy, the system has proved effective and is now paying dividends in the streamlining of accounts and investments.",
    communityInvolvement:
      "In addition to Scouts, Jill spends an afternoon per week volunteering at the Red Cross charity shop, helping sort donations, keep the shop floor tidy and run the till.",
    otherInformation:
      "Jill is professional in all that she does and has once again provided further especially distinguished service to the Scouts. Without her knowledge, experience, input and support with helping to manage this large County, it would have been a very difficult job. In recognition of her achievements, and for her further especially distinguished service within the District and County, I would like to nominate Jill for the Bar to Silver Acorn.",
    citation:
      "For further especially distinguished service over 28 years, single-handedly reforming and modernising County financial systems while providing invaluable administrative support to the District and its Groups.",
  },
  {
    nomineeName: "Sam Mountain",
    awardLevel: "Bar to the Silver Acorn",
    mainRole:
      "Sam has held the role of Section Team Member for over 40 years and during this time, he has also acted as Scout Section Team Leader for a neighbouring group when required. Since his last award, following a recent retirement, he accepted the District Lead Volunteer's request to undertake the more demanding role of Group Lead Volunteer, which is a large group that meets in its own headquarters. Since undertaking the role, he has completed his own modular learning as well as encouraging other Team Members group to complete their own learning.",
    additionalService:
      "With his new role, he regularly attends the District Group Lead Volunteer meetings as well as regular visits to his Sections encouraging them in their activities as well as supporting Award presentations and moving on ceremonies. He has developed and maintained the Group's website. The expanding Group which has a larger Beaver Scout Colony and Cub Scout Pack and a very active Scout Troop enjoy an ambitious and challenging Summer Camp and numerous weekend activities and Sam ensures that sufficient funds are made available to support and maintain these events. Sam also works tirelessly to promote water activities for Scouts across the County and his enthusiasm for a large range of water activities helps to inspire both young people and adults to take to the water. As County Learning Assessor, he leads a team of individuals who hold the Learning Assessor accreditation and has promoted a successful series of assessment days to encourage leaders to demonstrate the skills needed for activity permits. He also undertakes a key background role as a Boat Inspector in order to sustain water activities and to keep them safe. He also manages the annual District Canal Challenge event.",
    keyAchievements:
      "He has produced a challenging development plan in consultation with the Cub Section Team Leader and Scout Section Team Leader and resulted in the recruitment of members of the Group Trustee Board. An innovation Sam has introduced to the Group has been the annual Parent's camp at which families can camp and join in the activities and events which the young people can do. The camp not only encourages more active involvement from the parents, but also he arranges the Group's Annual General Meeting at the camp ensuring a greater attendance. This personal contact with parents has developed several into helpers and leaders.",
    levelOfService:
      "Sam was awarded the Silver Acorn in 2014 and has since then continued to provide further specially distinguished service to the Scouts in both the District and the County and we all feel that he is worthy of consideration for the Bar to the Silver Acorn.",
    communityInvolvement:
      "In addition to his work within the Scouts, Sam has supported the local Food Bank which now uses the Scout headquarters on a Thursday afternoon to distribute food to those in need. He opens up the hall for them and makes sure the brew is on ready for the volunteers. He arranges food collections through the Scouts and any food left over from camp also goes to support the Food Bank.",
    otherInformation:
      "In 2016 Sam received the Parish Council 'Volunteer of the Year' Award for his efforts in the community. This was well received by Sam and explains further how well regarded he is in the community.",
    citation:
      "For further specially distinguished service since his Silver Acorn, taking on Group Lead Volunteer responsibilities, promoting water activities across the County as Learning Assessor, and strengthening community partnerships through the local Food Bank.",
  },
  // --- Silver Wolf ---
  {
    nomineeName: "George Macgregor",
    awardLevel: "Silver Wolf",
    mainRole:
      "George has been a leader in the Scouts for 43 years. He has held many different roles but he has been the Section Team Leader in the 23rd Anywhere Scout Group for the past 20 years. In that role he has truly excelled. The breath and quality of the section programme is superb. George offers a well-balanced programme with lots of indoor and outdoor activities. It is a testament to this work that the Troop has grown to 40 youth members and this has been sustained in the past 12 years. The growth of the Troop is only limited by the size of their hall which is now in need of significant renovation. George is no one-man band. He has recruited a strong team of younger leaders and gives them all tasks and responsibilities appropriate to their experience. In the past 20 years he has encouraged many of them to take on Section Team Leader roles in other Groups. He has the support and respect not just of the parents of the Scouts in the Troop, but of the wider community. He is known affectionately as 'Mr Scout' in the village where he lives.",
    additionalService:
      "In addition to his main role as Scout Section Team Leader, George is a member of the County Volunteering Development Team looking after learning. He regularly acts as a staff member of the quarterly residential courses run by the County acting as both learning support and a facilitator. He is particularly strong in the sessions which focus on practical Scouts skills. He is also part of the Volunteering Development Team supporting learning for most of the leaders in his Troop and Group. He has become the go-to person for all things learning related in the District. Nothing is too much trouble for George in terms of supporting the learning of other leaders. He is very proud of the number of leaders he has helped towards gaining their Wood Badges (26 in the past 10 years by my reckoning). George was also District Scouts Programme Team Leader for four years. In this role he supported other Troops in the District and was surprisingly well liked for his open and focused approach to the role. For the past five years, George has run the District Scout Camp on behalf of the District Lead Volunteer. From a low start of four Troops being involved at the start, now all Troops in the District take part. It has become a key feature of the annual District programme.",
    keyAchievements:
      "Since his last award, George has focused on trying to improve the number of his Scouts that achieve the section's top award. From a low start of around 25%, in the past five years, over 70% of the Scouts have achieved the Chief Scout's Gold Award. Three years ago, he encouraged the Group Trustee Board to embark on a major renovation project for their Scout Hall. This required investment of around £40,000 and George was the most active member of the Group fundraising committee, building on his experience fundraising for the local hospice. To date the Group has raised £35,000 and the work on the hall has just started.",
    levelOfService:
      "George has given sterling service to the Scouts for over 43 years. He delivers the highest level of service to every role or task he undertakes. He will not take on a task unless he feels that he can deliver on it. Whether it is the quality of the Troop programme, the quality of adult learning, the District Troop camp or fundraising activities for the hall, his energy and dedication to the Scouts continues unabated despite his increasing age and recent ill health. George always offers 110%! He is widely respected in the District, the County and in the local Community. His service to the Scouts over the years clearly qualifies as being 'of the most exceptional nature'. I can think of no-one more deserving of the highest Good Service Award, the Silver Wolf.",
    communityInvolvement:
      "In addition to his Scout roles, George is a Governor at the local Primary School. He is also a regular fundraiser for St Mary's Hospice in the next village. In the past 10 years George's efforts alone have raised £25,000 for the Hospice.",
    otherInformation:
      "George had to step down as the District Programme Team Leader Scouts as he had to go into hospital for an operation. He continued to manage the Troop from his hospital bed and from home in the short time he was out of action but felt that he could not fulfil the responsibilities of the role as well. Despite stepping back from this role, he continues to offer informal support to both his successor and to the wider Scouts community in general.",
    citation:
      "For 43 years of service of the most exceptional nature, delivering outstanding programmes, supporting 26 leaders to Wood Badge, growing the District Scout Camp, and raising funds for both Scouting and the wider community. George is 'Mr Scout' and thoroughly deserving of the Silver Wolf.",
  },
  {
    nomineeName: "Mohammad Sagir",
    awardLevel: "Silver Wolf",
    mainRole:
      "Since receiving his last award in 2018, Mo has continued to exemplify the highest standards of service within Scouting, showing unwavering dedication, adaptability, and leadership. As Assistant District Commissioner (ADC) for Scouts, now Programme Support Member for Scouts, Mo supports nine Scout sections across Any City, many of which operate in areas of high deprivation (IMD 1/2). He has been instrumental in ensuring that young people — regardless of background — have access to high-quality, engaging Scouting experiences. Mo works tirelessly to mentor and support section leaders, helping them overcome local challenges while maintaining a consistent and ambitious programme across the District. Throughout the COVID-19 pandemic, Mo remained a cornerstone of Scouting within the district. Despite the immense challenges, he kept his section active, engaged, and thriving. As restrictions eased, Mo successfully rebuilt momentum, increasing both youth membership and participation in district activities. In his role as ADC Scouts, Mo has provided steady and practical leadership across the district. He has worked closely with Scout section leaders to strengthen their weekly programmes. One of his key achievements has been the development of a structured district programme that helps young people progress toward their Chief Scout's Gold Award. This programme also includes many district-led activities such as the Get Out of That, Backwards Cooking and Camping competitions as well as a district hike. On average 5/6 of the groups will attend, approximately 100 young people per activity. Mo was also key in supporting the District bi-annual Camp and led on the Scout programme for the weekend, involving over 300 young people and 75 leaders.",
    additionalService:
      "In addition to his District role, Mo is also a core team member at the 1st Any Town Scout Group, where he continues to be directly involved in weekly section meetings and activity delivery. His presence at the group level keeps him connected to young people and the practical realities of running a Scout section, which informs and strengthens his District leadership. The 1st Any Town is one of the biggest groups in Any Town, with 30 scouts. Prior to covid they had 25 scouts and at the 2020 census 5; this year they have 30 scouts and this increase and bounce back is due to the great work Mo is doing.",
    keyAchievements:
      "Mo created a structured and inclusive programme across Any Town that enables Scouts to work toward the Chief Scout's Gold Award, including support for more challenging requirements such as the Expedition Challenge. This programme ensures equitable access for all Scouts, regardless of their group's individual capacity. Mo played a vital role in revitalising Scouting after the pandemic, both within his own group and across the District. His leadership helped increase Scout numbers, re-establish residential experiences, and bring District events back stronger than before. Mo successfully delivers large-scale events including the 'Get Out of That' team challenge, Backwards Cooking, Camping Competitions, and a District Hike. These events see participation from 5-6 groups on average (~100 young people per event), fostering both skills development and team spirit. Mo uses his qualifications and experience to provide essential First Aid training to young people, helping them earn Staged First Aid Badges (Levels 1 & 2).",
    levelOfService:
      "Mo consistently delivers service that goes far beyond the expectations of his roles. Since receiving his last award in 2018, he has maintained an exceptionally high level of commitment, providing both strategic leadership and hands-on delivery at District and Group levels. His leadership in developing a structured, inclusive District Scout programme demonstrates a proactive and visionary approach, ensuring that all Scouts across Any Town — regardless of local limitations — can access the full range of experiences required for the Chief Scout's Gold Award. Throughout and beyond the challenges of the COVID-19 pandemic, Mo has shown remarkable resilience, adaptability, and dedication, helping to rebuild sections, restore youth participation, and reinvigorate District events. Mo's level of service is marked by longevity, consistency, and excellence.",
    communityInvolvement:
      "For over 20 years, Mo has served as Treasurer of his Mosque, a role that goes far beyond managing finances. He has been a trusted and active member of the Muslim community, applying his practical skills and financial insight to support long-term sustainability. One of his most notable achievements in this role was his successful campaign to prevent grey water taxation from being applied to places of worship. Thanks to his persistence and advocacy, the Mosque was granted an exemption — saving the community thousands of pounds annually. Since retiring two years ago, Mo has continued to give back by volunteering weekly at the Any Town Food Bank, where he helps to sort and replenish stock every Wednesday.",
    otherInformation:
      "N/A.",
    citation:
      "For his continued dedication, adaptability and leadership to Any Town District Scouts.",
  },
];

export function getSampleCitations(
  awardName?: AwardName,
): SampleCitationsResponse {
  if (awardName === undefined) {
    return {
      samples: SAMPLE_NOMINATIONS,
      awardLevel: "all",
    };
  }

  return {
    samples: SAMPLE_NOMINATIONS.filter((s) => s.awardLevel === awardName),
    awardLevel: awardName,
  };
}
