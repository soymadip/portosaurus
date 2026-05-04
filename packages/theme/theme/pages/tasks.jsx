import { useState } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import "../css/tasks.css";
import {
  FaClipboardList,
  FaSyncAlt,
  FaClock,
  FaCheckCircle,
  FaFire,
  FaThermometerHalf,
  FaSnowflake,
  FaTasks,
  FaExclamationTriangle,
} from "react-icons/fa";
function TaskList({ filterStatus, taskList }) {
  if (!taskList || !Array.isArray(taskList)) {
    return jsxDEV_7x81h0kn(
      "div",
      {
        className: "task-empty-state",
        children: [
          jsxDEV_7x81h0kn(
            FaTasks,
            { className: "task-empty-icon" },
            undefined,
            false,
            undefined,
            this,
          ),
          jsxDEV_7x81h0kn(
            "p",
            { children: "No tasks available" },
            undefined,
            false,
            undefined,
            this,
          ),
        ],
      },
      undefined,
      true,
      undefined,
      this,
    );
  }
  const filteredTasks = taskList.filter((task) =>
    filterStatus ? task.status === filterStatus : true,
  );
  if (filteredTasks.length === 0) {
    return jsxDEV_7x81h0kn(
      "div",
      {
        className: "task-empty-state",
        children: [
          jsxDEV_7x81h0kn(
            FaTasks,
            { className: "task-empty-icon" },
            undefined,
            false,
            undefined,
            this,
          ),
          jsxDEV_7x81h0kn(
            "p",
            { children: "No tasks in this category" },
            undefined,
            false,
            undefined,
            this,
          ),
        ],
      },
      undefined,
      true,
      undefined,
      this,
    );
  }
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const statusOrder = { active: 1, pending: 2, completed: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: "task-list-container",
      children: jsxDEV_7x81h0kn(
        "div",
        {
          className: "task-list-table",
          children: [
            jsxDEV_7x81h0kn(
              "div",
              {
                className: "task-list-header",
                children: [
                  jsxDEV_7x81h0kn(
                    "div",
                    {
                      className: "task-cell task-cell-status",
                      children: "Status",
                    },
                    undefined,
                    false,
                    undefined,
                    this,
                  ),
                  jsxDEV_7x81h0kn(
                    "div",
                    {
                      className: "task-cell task-cell-title",
                      children: "Task Details",
                    },
                    undefined,
                    false,
                    undefined,
                    this,
                  ),
                  jsxDEV_7x81h0kn(
                    "div",
                    {
                      className: "task-cell task-cell-priority",
                      children: "Priority",
                    },
                    undefined,
                    false,
                    undefined,
                    this,
                  ),
                ],
              },
              undefined,
              true,
              undefined,
              this,
            ),
            jsxDEV_7x81h0kn(
              "div",
              {
                className: "task-rows",
                children: sortedTasks.map((task, index) =>
                  jsxDEV_7x81h0kn(
                    "div",
                    {
                      className: `task-row ${task.status === "completed" ? "task-row-completed" : ""} ${index % 2 === 1 ? "task-row-striped" : ""}`,
                      children: [
                        jsxDEV_7x81h0kn(
                          "div",
                          {
                            className: "task-cell task-cell-status",
                            children: jsxDEV_7x81h0kn(
                              "span",
                              {
                                className: `badge badge-status-${task.status}`,
                                children: [
                                  task.status === "completed" &&
                                    jsxDEV_7x81h0kn(
                                      Fragment_8vg9x3sq,
                                      {
                                        children: [
                                          jsxDEV_7x81h0kn(
                                            FaCheckCircle,
                                            { className: "badge-icon" },
                                            undefined,
                                            false,
                                            undefined,
                                            this,
                                          ),
                                          " Done",
                                        ],
                                      },
                                      undefined,
                                      true,
                                      undefined,
                                      this,
                                    ),
                                  task.status === "active" &&
                                    jsxDEV_7x81h0kn(
                                      Fragment_8vg9x3sq,
                                      {
                                        children: [
                                          jsxDEV_7x81h0kn(
                                            FaSyncAlt,
                                            { className: "badge-icon spin" },
                                            undefined,
                                            false,
                                            undefined,
                                            this,
                                          ),
                                          " In Progress",
                                        ],
                                      },
                                      undefined,
                                      true,
                                      undefined,
                                      this,
                                    ),
                                  task.status === "pending" &&
                                    jsxDEV_7x81h0kn(
                                      Fragment_8vg9x3sq,
                                      {
                                        children: [
                                          jsxDEV_7x81h0kn(
                                            FaClock,
                                            { className: "badge-icon" },
                                            undefined,
                                            false,
                                            undefined,
                                            this,
                                          ),
                                          " Planned",
                                        ],
                                      },
                                      undefined,
                                      true,
                                      undefined,
                                      this,
                                    ),
                                ],
                              },
                              undefined,
                              true,
                              undefined,
                              this,
                            ),
                          },
                          undefined,
                          false,
                          undefined,
                          this,
                        ),
                        jsxDEV_7x81h0kn(
                          "div",
                          {
                            className: "task-cell task-cell-title",
                            children: [
                              jsxDEV_7x81h0kn(
                                "div",
                                {
                                  className: "task-title",
                                  children: task.title,
                                },
                                undefined,
                                false,
                                undefined,
                                this,
                              ),
                              task.desc &&
                                jsxDEV_7x81h0kn(
                                  "div",
                                  {
                                    className: "task-description",
                                    children: task.desc,
                                  },
                                  undefined,
                                  false,
                                  undefined,
                                  this,
                                ),
                            ],
                          },
                          undefined,
                          true,
                          undefined,
                          this,
                        ),
                        jsxDEV_7x81h0kn(
                          "div",
                          {
                            className: "task-cell task-cell-priority",
                            children: jsxDEV_7x81h0kn(
                              "span",
                              {
                                className: `badge badge-priority-${task.priority}`,
                                children: [
                                  task.priority === "high" &&
                                    jsxDEV_7x81h0kn(
                                      Fragment_8vg9x3sq,
                                      {
                                        children: [
                                          jsxDEV_7x81h0kn(
                                            FaFire,
                                            { className: "badge-icon" },
                                            undefined,
                                            false,
                                            undefined,
                                            this,
                                          ),
                                          " High",
                                        ],
                                      },
                                      undefined,
                                      true,
                                      undefined,
                                      this,
                                    ),
                                  task.priority === "medium" &&
                                    jsxDEV_7x81h0kn(
                                      Fragment_8vg9x3sq,
                                      {
                                        children: [
                                          jsxDEV_7x81h0kn(
                                            FaThermometerHalf,
                                            { className: "badge-icon" },
                                            undefined,
                                            false,
                                            undefined,
                                            this,
                                          ),
                                          " Medium",
                                        ],
                                      },
                                      undefined,
                                      true,
                                      undefined,
                                      this,
                                    ),
                                  task.priority === "low" &&
                                    jsxDEV_7x81h0kn(
                                      Fragment_8vg9x3sq,
                                      {
                                        children: [
                                          jsxDEV_7x81h0kn(
                                            FaSnowflake,
                                            { className: "badge-icon" },
                                            undefined,
                                            false,
                                            undefined,
                                            this,
                                          ),
                                          " Low",
                                        ],
                                      },
                                      undefined,
                                      true,
                                      undefined,
                                      this,
                                    ),
                                ],
                              },
                              undefined,
                              true,
                              undefined,
                              this,
                            ),
                          },
                          undefined,
                          false,
                          undefined,
                          this,
                        ),
                      ],
                    },
                    index,
                    true,
                    undefined,
                    this,
                  ),
                ),
              },
              undefined,
              false,
              undefined,
              this,
            ),
          ],
        },
        undefined,
        true,
        undefined,
        this,
      ),
    },
    undefined,
    false,
    undefined,
    this,
  );
}
function TaskStats({ taskList }) {
  if (!taskList || !Array.isArray(taskList)) {
    return null;
  }
  const total = taskList.length;
  const completed = taskList.filter(
    (task) => task.status === "completed",
  ).length;
  const active = taskList.filter((task) => task.status === "active").length;
  const pending = taskList.filter((task) => task.status === "pending").length;
  const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: "stats-container",
      children: [
        jsxDEV_7x81h0kn(
          "div",
          {
            className: "stat-box",
            children: [
              jsxDEV_7x81h0kn(
                "div",
                { className: "stat-label", children: "Total Tasks" },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "div",
                { className: "stat-value", children: total },
                undefined,
                false,
                undefined,
                this,
              ),
            ],
          },
          undefined,
          true,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "div",
          {
            className: "stat-box",
            children: [
              jsxDEV_7x81h0kn(
                "div",
                { className: "stat-label", children: "Completed" },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "div",
                {
                  className: "stat-value stat-value-completed",
                  children: completed,
                },
                undefined,
                false,
                undefined,
                this,
              ),
            ],
          },
          undefined,
          true,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "div",
          {
            className: "stat-box",
            children: [
              jsxDEV_7x81h0kn(
                "div",
                { className: "stat-label", children: "In Progress" },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "div",
                { className: "stat-value stat-value-active", children: active },
                undefined,
                false,
                undefined,
                this,
              ),
            ],
          },
          undefined,
          true,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "div",
          {
            className: "stat-box",
            children: [
              jsxDEV_7x81h0kn(
                "div",
                { className: "stat-label", children: "Planned" },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "div",
                {
                  className: "stat-value stat-value-pending",
                  children: pending,
                },
                undefined,
                false,
                undefined,
                this,
              ),
            ],
          },
          undefined,
          true,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "div",
          {
            className: "stat-box",
            children: [
              jsxDEV_7x81h0kn(
                "div",
                { className: "stat-label", children: "Progress" },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "div",
                { className: "stat-value", children: [percentComplete, "%"] },
                undefined,
                true,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "div",
                {
                  className: "progress-bar-container",
                  children: jsxDEV_7x81h0kn(
                    "div",
                    {
                      className: "progress-bar",
                      style: { width: `${percentComplete}%` },
                    },
                    undefined,
                    false,
                    undefined,
                    this,
                  ),
                },
                undefined,
                false,
                undefined,
                this,
              ),
            ],
          },
          undefined,
          true,
          undefined,
          this,
        ),
      ],
    },
    undefined,
    true,
    undefined,
    this,
  );
}
function TaskTabs({ taskList }) {
  const [activeTab, setActiveTab] = useState("all");
  if (!taskList || !Array.isArray(taskList)) {
    return null;
  }
  const tabData = [
    {
      id: "all",
      label: "All Tasks",
      icon: jsxDEV_7x81h0kn(
        FaClipboardList,
        {},
        undefined,
        false,
        undefined,
        this,
      ),
      count: taskList.length,
    },
    {
      id: "active",
      label: "In Progress",
      icon: jsxDEV_7x81h0kn(
        FaSyncAlt,
        { className: "spin" },
        undefined,
        false,
        undefined,
        this,
      ),
      count: taskList.filter((t) => t.status === "active").length,
    },
    {
      id: "pending",
      label: "Planned",
      icon: jsxDEV_7x81h0kn(FaClock, {}, undefined, false, undefined, this),
      count: taskList.filter((t) => t.status === "pending").length,
    },
    {
      id: "completed",
      label: "Completed",
      icon: jsxDEV_7x81h0kn(
        FaCheckCircle,
        {},
        undefined,
        false,
        undefined,
        this,
      ),
      count: taskList.filter((t) => t.status === "completed").length,
    },
  ];
  return jsxDEV_7x81h0kn(
    "div",
    {
      className: "task-tabs-container",
      children: [
        jsxDEV_7x81h0kn(
          "div",
          {
            className: "task-tabs",
            role: "tablist",
            "aria-label": "Task categories",
            children: tabData.map((tab) =>
              jsxDEV_7x81h0kn(
                "button",
                {
                  className: `task-tab ${activeTab === tab.id ? "task-tab-active" : ""}`,
                  onClick: () => setActiveTab(tab.id),
                  role: "tab",
                  "aria-selected": activeTab === tab.id,
                  "aria-controls": `tab-content-${tab.id}`,
                  id: `tab-${tab.id}`,
                  children: [
                    jsxDEV_7x81h0kn(
                      "span",
                      {
                        className: "task-tab-icon",
                        "aria-hidden": "true",
                        children: tab.icon,
                      },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                    jsxDEV_7x81h0kn(
                      "span",
                      { className: "task-tab-label", children: tab.label },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                    jsxDEV_7x81h0kn(
                      "span",
                      { className: "task-tab-count", children: tab.count },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                  ],
                },
                tab.id,
                true,
                undefined,
                this,
              ),
            ),
          },
          undefined,
          false,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "div",
          {
            className: "task-tab-content",
            role: "tabpanel",
            id: `tab-content-${activeTab}`,
            "aria-labelledby": `tab-${activeTab}`,
            children: [
              activeTab === "all" &&
                jsxDEV_7x81h0kn(
                  TaskList,
                  { taskList },
                  undefined,
                  false,
                  undefined,
                  this,
                ),
              activeTab === "active" &&
                jsxDEV_7x81h0kn(
                  TaskList,
                  { taskList, filterStatus: "active" },
                  undefined,
                  false,
                  undefined,
                  this,
                ),
              activeTab === "pending" &&
                jsxDEV_7x81h0kn(
                  TaskList,
                  { taskList, filterStatus: "pending" },
                  undefined,
                  false,
                  undefined,
                  this,
                ),
              activeTab === "completed" &&
                jsxDEV_7x81h0kn(
                  TaskList,
                  { taskList, filterStatus: "completed" },
                  undefined,
                  false,
                  undefined,
                  this,
                ),
            ],
          },
          undefined,
          true,
          undefined,
          this,
        ),
      ],
    },
    undefined,
    true,
    undefined,
    this,
  );
}
export default function TasksPage() {
  const { siteConfig } = useDocusaurusContext();
  const { customFields } = siteConfig || {};
  const tasksPage = customFields?.tasksPage;
  const heading = tasksPage.heading || "Tasks";
  const subheading = tasksPage.subheading || "Roadmap & Goals";
  const taskList =
    tasksPage.enable && tasksPage.taskList ? tasksPage.taskList : [];
  if (!tasksPage || !tasksPage.enable) {
    return jsxDEV_7x81h0kn(
      Layout,
      {
        title: "Tasks are Disabled",
        description: "Tasks are currently disabled",
        children: jsxDEV_7x81h0kn(
          "div",
          {
            className: "tasks-container",
            children: jsxDEV_7x81h0kn(
              "div",
              {
                className: "tasks-content",
                children: jsxDEV_7x81h0kn(
                  "div",
                  {
                    className: "tasks-disabled-notice",
                    children: [
                      jsxDEV_7x81h0kn(
                        "div",
                        {
                          className: "disabled-icon",
                          children: jsxDEV_7x81h0kn(
                            FaExclamationTriangle,
                            { "aria-hidden": "true" },
                            undefined,
                            false,
                            undefined,
                            this,
                          ),
                        },
                        undefined,
                        false,
                        undefined,
                        this,
                      ),
                      jsxDEV_7x81h0kn(
                        "h2",
                        {
                          className: "disabled-title",
                          children: "Tasks are currently disabled",
                        },
                        undefined,
                        false,
                        undefined,
                        this,
                      ),
                      jsxDEV_7x81h0kn(
                        "p",
                        {
                          className: "disabled-help",
                          children: [
                            "To enable tasks, set ",
                            jsxDEV_7x81h0kn(
                              "code",
                              { children: "tasks.enable" },
                              undefined,
                              false,
                              undefined,
                              this,
                            ),
                            " to",
                            " ",
                            jsxDEV_7x81h0kn(
                              "code",
                              { children: "true" },
                              undefined,
                              false,
                              undefined,
                              this,
                            ),
                          ],
                        },
                        undefined,
                        true,
                        undefined,
                        this,
                      ),
                    ],
                  },
                  undefined,
                  true,
                  undefined,
                  this,
                ),
              },
              undefined,
              false,
              undefined,
              this,
            ),
          },
          undefined,
          false,
          undefined,
          this,
        ),
      },
      undefined,
      false,
      undefined,
      this,
    );
  }
  return jsxDEV_7x81h0kn(
    Layout,
    {
      title: heading,
      description: subheading,
      children: [
        jsxDEV_7x81h0kn(
          Head,
          {
            children: [
              jsxDEV_7x81h0kn(
                "meta",
                { property: "og:title", content: heading },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "meta",
                { property: "og:description", content: subheading },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "meta",
                { name: "twitter:title", content: heading },
                undefined,
                false,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "meta",
                { name: "twitter:description", content: subheading },
                undefined,
                false,
                undefined,
                this,
              ),
            ],
          },
          undefined,
          true,
          undefined,
          this,
        ),
        jsxDEV_7x81h0kn(
          "div",
          {
            className: "tasks-container",
            children: [
              jsxDEV_7x81h0kn(
                "div",
                {
                  className: "tasks-header",
                  children: [
                    jsxDEV_7x81h0kn(
                      "h1",
                      { className: "tasks-heading", children: heading },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                    subheading &&
                      jsxDEV_7x81h0kn(
                        "p",
                        { className: "tasks-subheading", children: subheading },
                        undefined,
                        false,
                        undefined,
                        this,
                      ),
                  ],
                },
                undefined,
                true,
                undefined,
                this,
              ),
              jsxDEV_7x81h0kn(
                "div",
                {
                  className: "tasks-content",
                  children: [
                    jsxDEV_7x81h0kn(
                      TaskStats,
                      { taskList },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                    jsxDEV_7x81h0kn(
                      TaskTabs,
                      { taskList },
                      undefined,
                      false,
                      undefined,
                      this,
                    ),
                  ],
                },
                undefined,
                true,
                undefined,
                this,
              ),
            ],
          },
          undefined,
          true,
          undefined,
          this,
        ),
      ],
    },
    undefined,
    true,
    undefined,
    this,
  );
}
