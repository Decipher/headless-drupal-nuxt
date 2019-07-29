<template>
  <div class="slides">
    <section>
      <h2>Headless Forms with Drupal JSON:API Entities</h2>
      <h4>
        by <a href="mailto:stuart@realityloop.com">Stuart @ Realityloop.com</a>
      </h4>
    </section>

    <section>
      <h2>Headless Drupal / ContentCMS</h2>
      <a href="https://www.contentacms.org/" target="_blank">contentacms.org</a>
    </section>

    <section>
      <h2>JSON:API Entity schema</h2>
      <h2>=</h2>
      <ul>
        <li>Entity form display</li>
        <li>Field configuration</li>
        <li>Field storage configruation</li>
      </ul>
    </section>

    <section>
      <h2>Entity Form Display</h2>
      <section>
        <small>
          <a
            href="http://api.headless-blog.localhost/admin/structure/types/manage/blog/fields"
            target="_blank"
          >
            /admin/structure/types/manage/blog/fields
          </a>
        </small>
        <img src="@/assets/images/entity_form_display.png" />
      </section>

      <section>
        <small>
          <a
            href="http://api.headless-blog.localhost/api/entity_form_display/entity_form_display?filter[bundle]=blog"
            target="_blank"
          >
            /api/entity_form_display/entity_form_display?filter[bundle]=blog
          </a>
        </small>
        <pre><code data-trim data-noescape>{
  ...
  "data": [
    {
      "type": "entity_form_display--entity_form_display",
      "id": "67058401-3b4a-40f5-bd41-c020bc4e90ec",
      "attributes": {
        "langcode": "en",
        "status": true,
        "dependencies": {
          ...
        },
        "drupal_internal__id": "node.blog.default",
        "targetEntityType": "node",
        "bundle": "blog",
        "mode": "default",
        "content": {
<mark>          "body": {
            "type": "text_textarea_with_summary",
            "weight": 121,
            "settings": {
              "rows": 9,
              "summary_rows": 3,
              "placeholder": ""
            },
            "third_party_settings": [],
            "region": "content"
          },</mark>
          "created": {
            "type": "datetime_timestamp",
            "weight": 10,
            "region": "content",
            "settings": [],
            "third_party_settings": []
          },
          ...
        },
        "hidden": []
      },
      ...
    }
  ],
  "links": {
    ...
  }
}
        </code></pre>
      </section>
      <section>
        <ul>
          <li>Permission(s): <strong>administer display modes</strong>.</li>
          <li>Multiple region and view modes supported.</li>
          <li>Third party configuration, e.g. Field Group.</li>
          <li>One entry per view mode.</li>
          <li>Filterable by entity type and bundle.</li>
        </ul>
      </section>
    </section>

    <section>
      <h2>Field configuration</h2>
      <section>
        <small>
          <a
            href="http://api.headless-blog.localhost/admin/structure/types/manage/blog/fields/node.blog.body"
            target="_blank"
          >
            /admin/structure/types/manage/blog/fields/node.blog.body
          </a>
        </small>
        <img src="@/assets/images/field_config.png" />
      </section>

      <section>
        <small>
          <a
            href="http://api.headless-blog.localhost/api/field_config/field_config?filter[bundle]=blog&filter[entity_type]=node"
            target="_blank"
          >
            /api/field_config/field_config?filter[bundle]=blog&filter[entity_type]=node
          </a>
        </small>
        <pre><code data-trim data-noescape>{
  ...
  "data": [
    {
      "type": "field_config--field_config",
      "id": "3aeb8aac-3356-4622-aad9-b91c9abfbf52",
      "attributes": {
        "langcode": "en",
        "status": true,
        "dependencies": {
          ...
        },
        "drupal_internal__id": "node.blog.body",
<mark>        "field_name": "body",
        "entity_type": "node",
        "bundle": "blog",
        "label": "Body",
        "description": "",
        "required": false,</mark>
        "translatable": true,
        "default_value": [],
        "default_value_callback": "",
        "settings": {
          "display_summary": true
        },
        "field_type": "text_with_summary"
      },
      ...
    }
  ],
  ...
}
        </code></pre>
      </section>
      <section>
        <ul>
          <li>Permission(s): <strong>administer ENTITY fields</strong>.</li>
          <li>One entry per field.</li>
          <li>Filterable by entity type and bundle.</li>
        </ul>
      </section>
    </section>

    <section>
      <h2>Field storage configuration</h2>
      <section>
        <small>
          <a
            href="http://api.headless-blog.localhost/admin/structure/types/manage/blog/fields/node.blog.body/storage"
            target="_blank"
          >
            /admin/structure/types/manage/blog/fields/node.blog.body/storage
          </a>
        </small>
        <img src="@/assets/images/field_storage_config.png" />
      </section>

      <section>
        <small>
          <a
            href="http://api.headless-blog.localhost/api/field_config/field_config?filter[bundle]=blog&filter[entity_type]=node"
            target="_blank"
          >
            /api/field_config/field_config?filter[bundle]=blog&filter[entity_type]=node
          </a>
        </small>
        <pre><code data-trim data-noescape>{
  ...
  "data": [
    {
      "type": "field_storage_config--field_storage_config",
      "id": "c5d1c141-b5f7-45c3-bb1c-c518635a6e62",
      "attributes": {
        "langcode": "en",
        "status": true,
        "dependencies": {
          ...
        },
        "drupal_internal__id": "node.body",
        "field_name": "body",
        "entity_type": "node",
        "field_storage_config_type": "text_with_summary",
        "settings": [],
        "module": "text",
        "locked": false,
        "cardinality": 1,
        "translatable": true,
        "indexes": [],
        "persist_with_no_fields": true,
        "custom_storage": false
      },
      ...
    }
  ],
  ...
}
        </code></pre>
      </section>
      <section>
        <ul>
          <li>Permission(s): <strong>administer ENTITY fields</strong>.</li>
          <li>One entry per field.</li>
          <li>Filterable by entity type only.</li>
        </ul>
      </section>
    </section>

    <section>
      <h2>Processing the schema...</h2>
      <ul>
        <li>OAuth</li>
        <li>
          Subrequests:
          <a href="https://www.drupal.org/project/subrequests" target="_blank">
            drupal.org/project/subrequests
          </a>
        </li>
        <li>
          Deserialize:
          <a
            href="https://www.npmjs.com/package/jsonapi-serializer"
            target="_blank"
          >
            npmjs.com/package/jsonapi-serializer
          </a>
        </li>
        <li>Caching</li>
      </ul>
    </section>

    <section>
      <h2>Result</h2>
      <pre><code data-trim data-noescape>{
  "fields": [
    {
      "id": "title",
      "settings": {
        "size": 60,
        "placeholder": ""
      },
      "type": "string-textfield",
      "weight": -5
    },
    {
      "id": "langcode",
      "settings": {
        "includeLocked": true
      },
      "type": "language-select",
      "weight": 2
    },
    {
      "id": "uid",
      "settings": {
        "matchOperator": "CONTAINS",
        "size": 60,
        "placeholder": ""
      },
      "type": "entity-reference-autocomplete",
      "weight": 5
    },
    {
      "id": "created",
      "settings": [],
      "type": "datetime-timestamp",
      "weight": 10
    },
    {
      "id": "promote",
      "settings": {
        "displayLabel": true
      },
      "type": "boolean-checkbox",
      "weight": 15
    },
    {
      "id": "sticky",
      "settings": {
        "displayLabel": true
      },
      "type": "boolean-checkbox",
      "weight": 16
    },
    {
      "id": "path",
      "settings": [],
      "type": "path",
      "weight": 30
    },
    {
      "id": "status",
      "settings": {
        "displayLabel": true
      },
      "type": "boolean-checkbox",
      "weight": 120
    },
<mark>    {
      "id": "body",
      "settings": {
        "rows": 9,
        "summaryRows": 3,
        "placeholder": "",
        "displaySummary": true
      },
      "type": "text-textarea-with-summary",
      "weight": 121,
      "label": "Body",
      "description": "",
      "required": false,
      "cardinality": 1
      }</mark>
  ],
  "keys": [
    "body",
    "created",
    "langcode",
    "path",
    "promote",
    "status",
    "sticky",
    "title",
    "uid"
  ]
}
      </code></pre>
    </section>

    <section>
      <h2>And then?</h2>
      <ul>
        <li>
          <a
            href="https://www.npmjs.com/package/vue-form-generator"
            target="_blank"
          >
            vue-form-generator
          </a>
        </li>
        <li>Component per <strong>type</strong></li>
      </ul>
    </section>

    <section>
      <v-btn color="green" large nuxt to="/">Demo time</v-btn>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'reveal'
}
</script>
