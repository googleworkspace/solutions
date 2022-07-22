# How to become a contributor and submit your own code

## Contributor License Agreements

Please fill out either the individual or corporate Contributor License Agreement
(CLA).

  * If you are an individual writing original source code and you're sure you
    own the intellectual property, then you'll need to sign an
    [individual CLA](https://developers.google.com/open-source/cla/individual).
  * If you work for a company that wants to allow you to contribute your work,
    then you'll need to sign a
    [corporate CLA](https://developers.google.com/open-source/cla/corporate).

Follow either of the two links above to access the appropriate CLA and
instructions for how to sign and return it. Once we receive it, we'll be able to
accept your pull requests.

## Contributing a Patch

1. Submit an issue describing your proposed change to the repo in question.
1. The repo owner will respond to your issue promptly.
1. If your proposed change is accepted, and you haven't already done so, sign a Contributor License Agreement (see details above).
1. Fork the desired repo, develop and test your code changes.
1. Ensure that your code adheres to the existing style in the sample to which you are contributing.
1. Ensure that your code has an appropriate set of unit tests which all pass.
1. Submit a pull request!

## Contributing a Solution

The Solutions Gallery is accepting Apps Script contributions from the community. If you have an
idea for a solution to include, follow these steps:

## Step 1

Use this [issue template][issue_template] to submit an idea. We define a solution as an end-to-end
use case or workflow that solves a real business problem. A solution should solve a plausible
business use case. A solution should NOT be a feature or utility of specific products/APIs.

Yes: Manage employee timesheets
No: Use the Sheets API onEdit trigger to send notifications

Once you have approval from one of the repo owners, proceed to the next step.

[issue_template]: https://github.com/googleworkspace/solutions/issues/new?assignees=&labels=enhancement+%28new+solution%29&template=new-solution-request.md&title=

## Step 2

Implement your solution and use the [template directory][template_directory] to structure your
code sample. If your solution involves a spreadsheet, document or presentation, please include
sample data in the data directory (see [example][data_example]). You must fill in the 
[README.md][template_readme] with an image or gif for us to surface on the gallery page. 

[template_directory]: https://github.com/googleworkspace/solutions/tree/main/template
[template_readme]: https://github.com/googleworkspace/solutions/tree/main/template
[data_example]: https://github.com/googleworkspace/solutions/tree/main/equipment-requests

## Step 3

Send a pull request when ready for review. When your solution is merged, we will add it to the
gallery view.

### Issue monitoring

We monitor all feedback for solutions added to the gallery. If we discover a problem with your 
solution code, we will file an issue against you in this repo. All issues assigned to you should
be addressed within two weeks.

We reserve the right to edit or remove solutions in the gallery if they become outdated, lack of
maintenance, or another concern. If your solution is removed, you are welcome to resubmit an 
updated version at a later time.
